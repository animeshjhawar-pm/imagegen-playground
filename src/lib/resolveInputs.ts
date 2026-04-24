import type { StepDefinition, ImageType } from "@/config/pipelines";
import type { ClientState } from "@/state/playgroundReducer";
import { extractImageRequirementDescription } from "./parseImageRequirement";

/**
 * Resolves each input's value purely from its declared source — does NOT
 * factor in user overrides (`inputOverrides`). Callers (StepCell) are
 * responsible for checking per-input overrides and using the stored value
 * instead when appropriate.
 *
 * Sources (in order):
 *   step_output  → reads the referenced step's current output from the flow
 *   client_context → reads from client.context
 *   config / user_input → empty string (playground doesn't auto-fill these)
 */
export function resolveInputs(
  step: StepDefinition,
  client: ClientState,
  flowType: "old" | "new",
  /** When present, lets `generate_image_description` outputs auto-filter
   *  to the <image_requirement type="..."> tag matching the target
   *  pipeline. Downstream Step 4 then receives just one description. */
  imageType?: ImageType,
  /** Which "new" lane to resolve from (0 = original New, 1 = New 2, …).
   *  Ignored when flowType === "old". */
  flowIndex: number = 0
): Record<string, string> {
  const flow =
    flowType === "old"
      ? client.oldFlow
      : client.newFlows[flowIndex] ?? client.newFlows[0] ?? { stepStates: {} };
  const resolved: Record<string, string> = {};

  for (const inputDef of step.inputs) {
    // `sourceNew` overrides `source` when resolving the "new" flow.
    // Lets the same input name read a different value per flow (e.g.
    // Generate Page Structure's `topic` reads business_context in old
    // flow and the live page-image description in new flow).
    const source =
      flowType === "new" && inputDef.sourceNew
        ? inputDef.sourceNew
        : inputDef.source;

    if (source.kind === "step_output") {
      const refState = flow.stepStates[source.stepName];
      const raw = refState?.output ?? "";
      if (raw && source.field) {
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          const v = parsed[source.field];
          resolved[inputDef.name] =
            typeof v === "string" ? v : JSON.stringify(v ?? "");
        } catch {
          resolved[inputDef.name] = raw;
        }
      } else if (raw && source.stepName === "generate_image_description") {
        resolved[inputDef.name] = extractImageRequirementDescription(raw, imageType);
      } else {
        // `generate_page_structure` used to output a page_info JSON that
        // needed extractFirstPageInfoImageDescription to strip down to a
        // single description. Since the redesign (picker step), its output
        // is already the selected description string, so raw passthrough
        // is correct.
        resolved[inputDef.name] = raw;
      }
      continue;
    }

    if (source.kind === "client_context") {
      resolved[inputDef.name] = client.context[source.field] ?? "";
      continue;
    }

    // config / user_input — no automatic resolution
    resolved[inputDef.name] = "";
  }

  return resolved;
}

/**
 * Returns the effective display/run value for a single step input.
 * If the user has manually overridden this input, uses the stored value.
 * Otherwise falls back to the live resolved value from the source.
 */
export function getEffectiveInputValue(
  inputName: string,
  stepState: { inputs: Record<string, string>; inputOverrides: Record<string, boolean> },
  sourceResolved: Record<string, string>
): string {
  if (stepState.inputOverrides[inputName]) {
    return stepState.inputs[inputName] ?? "";
  }
  return sourceResolved[inputName] ?? "";
}
