import type { StepDefinition } from "@/config/pipelines";
import type { ClientState } from "@/state/playgroundReducer";

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
  flowType: "old" | "new"
): Record<string, string> {
  const flow = flowType === "old" ? client.oldFlow : client.newFlow;
  const resolved: Record<string, string> = {};

  for (const inputDef of step.inputs) {
    const { source } = inputDef;

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
      } else {
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
