"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayground } from "@/context/PlaygroundContext";
import { resolveFixedAspectRatio, type StepDefinition, type StepDiff, type PageType, type ImageType } from "@/config/pipelines";
import type { StepState, ClientState } from "@/state/playgroundReducer";
import { StatusDot } from "./StatusDot";
import { CollapsibleField } from "./CollapsibleField";
import { PromptDialog } from "./PromptDialog";
import { runStep } from "@/lib/runStep";
import { resolveInputs, getEffectiveInputValue } from "@/lib/resolveInputs";
import { interpolate } from "@/lib/interpolate";
import { prepareLLMVars } from "@/lib/prepareLLMVars";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className="w-4 h-4 mt-0.5 flex-shrink-0">
      <path fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V8.75a.75.75 0 00-1.5 0v4.5zm.75-6.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------
const DIFF_BADGE: Record<StepDiff, { label: string; className: string }> = {
  skipped:     { label: "SKIPPED",  className: "bg-neutral-800 text-neutral-600" },
  same_as_old: { label: "SAME",     className: "bg-neutral-700 text-neutral-400" },
  modified:    { label: "MODIFIED", className: "bg-amber-900/60 text-amber-400" },
  new:         { label: "NEW",      className: "bg-indigo-900/60 text-indigo-400" },
};
const PROVIDER_COLOR: Record<string, string> = {
  firecrawl: "text-orange-400",
  portkey:   "text-violet-400",
  replicate: "text-cyan-400",
  none:      "text-neutral-600",
};

/** Every step name that calls Replicate to produce an image. Used by
 *  the cell header (aspect pill, model pill hide), the model picker
 *  render gate, and the aspect-ratio-input lookup in runStep. The
 *  merged blog:cover_thumbnail pipeline uses `generate_cover_image`
 *  and `generate_thumbnail_image`; everything else still uses
 *  `generate_image`. */
const IMAGE_GEN_STEP_NAMES = new Set([
  "generate_image",
  "generate_cover_image",
  "generate_thumbnail_image",
]);
const isImageGenStep = (name: string) => IMAGE_GEN_STEP_NAMES.has(name);

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface StepCellProps {
  step: StepDefinition;
  flowType: "old" | "new";
  /** For flowType "new", which lane (0 = original, 1 = "New 2", …). */
  flowIndex?: number;
  clientId: string;
  client: ClientState;
  pageType: PageType;
  imageType: ImageType;
  defaultAspectRatio: string;
  /**
   * When true, the step is gated off for this (pipeline, flow) because
   * a required piece of client context is missing (see FlowRow →
   * getDisabledStepsForFlow). Renders a greyed-out body and hides the
   * Run button.
   */
  disabled?: boolean;
  /**
   * Applied to the outer <td>. Used by FlowRow so shared cells (picker
   * steps) span across all of a client's flow rows (old + every new
   * lane). Non-picker rows receive no rowSpan.
   */
  rowSpan?: number;
  /**
   * True when this cell represents a step that's shared across all of
   * the client's flows. Selection dispatches write to every flow state
   * at once via SET_SHARED_STEP_OUTPUT instead of the per-flow variant.
   */
  sharedAcrossFlows?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function StepCell({
  step, flowType, flowIndex = 0, clientId, client, pageType, imageType, defaultAspectRatio,
  disabled = false,
  rowSpan, sharedAcrossFlows = false,
}: StepCellProps) {
  const { dispatch } = usePlayground();
  const pipelineKey = `${pageType}:${imageType}`;

  const flow =
    flowType === "old"
      ? client.oldFlow
      : client.newFlows[flowIndex] ?? { stepStates: {} };
  const stepState: StepState = flow.stepStates[step.name] ?? {
    inputs: {}, inputOverrides: {}, output: "", lastRunOutput: "",
    status: "idle", isOutputOverride: false,
  };

  const sourceResolved = useMemo(
    () => resolveInputs(step, client, flowType, imageType, flowIndex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, client, flowType, imageType, flowIndex]
  );

  const diff: StepDiff = flowType === "old" ? step.diffOld : step.diffNew;
  const badge = DIFF_BADGE[diff];
  const isSkipped  = diff === "skipped";
  const isRunning  = stepState.status === "running";
  const isFailed   = stepState.status === "failed";

  // ── Picker step (Choose Image Description) ───────────────────────────────
  // Parse the options_json input into a string[] for the picker UI. When
  // the step has no output yet, auto-select options[0] so downstream
  // steps see a usable value without the user having to click.
  //
  // Each option may be either:
  //   - a plain string (e.g. blog topic / image description), OR
  //   - a JSON-stringified object with a `label` field plus arbitrary
  //     other fields. The picker shows the label; the picker output is
  //     the full JSON string. Downstream steps can then resolve specific
  //     fields via `source: { kind: "step_output", stepName, field }`.
  const pickerOptions: string[] | null = useMemo(() => {
    if (!step.picker) return null;
    const raw = sourceResolved["options_json"] ?? "";
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (entry && typeof entry === "object") {
            // Object option — re-stringify it so the picker output is
            // self-contained JSON that downstream steps can field-pluck.
            try { return JSON.stringify(entry); } catch { return ""; }
          }
          return "";
        })
        .filter((s) => s.length > 0);
    } catch {
      return [];
    }
  }, [step.picker, sourceResolved]);

  /** Display preview for a picker option. Plain strings render as-is.
   *  JSON-object options render their `label` field; falls back to a
   *  truncated raw-JSON view if no label is present. */
  function pickerLabelFor(opt: string): string {
    if (!opt) return "";
    if (opt[0] !== "{" && opt[0] !== "[") return opt;
    try {
      const parsed = JSON.parse(opt) as { label?: unknown };
      if (parsed && typeof parsed.label === "string" && parsed.label.length > 0) {
        return parsed.label;
      }
    } catch { /* fall through */ }
    return opt.length > 200 ? opt.slice(0, 200) + "…" : opt;
  }

  useEffect(() => {
    if (!step.picker || !pickerOptions || pickerOptions.length === 0) return;
    if (disabled) return;
    // Initialise to options[0] when empty; leaves manual overrides alone.
    if ((stepState.output ?? "").trim() === "" && !stepState.isOutputOverride) {
      if (sharedAcrossFlows) {
        dispatch({
          type: "SET_SHARED_STEP_OUTPUT",
          clientId, stepName: step.name,
          output: pickerOptions[0],
        });
      } else {
        dispatch({
          type: "SET_STEP_RUN_OUTPUT",
          clientId, flowType, flowIndex,
          stepName: step.name,
          output: pickerOptions[0],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerOptions?.length, step.picker]);

  // Auto-render renderOnly *image-URL* steps as soon as their inputs
  // are ready — no Run-Step click required. Scoped to outputType
  // "image_url" + renderOnly + non-picker so it ONLY catches the
  // display-only image cells (currently service:amp_up's old-flow
  // generate_image, whose systemPromptOld is "{{amped_image_url}}").
  // Other renderOnly steps that produce text prompts (legacy blog
  // cover/internal) keep their existing user-triggered behavior.
  useEffect(() => {
    if (!step.renderOnly) return;
    if (step.picker) return;                         // picker has its own auto-init above
    if (step.outputType !== "image_url") return;     // narrow to display-only image cells
    if (disabled) return;
    if (stepState.status === "running") return;

    // Prefer explicit renderTemplateOld / renderTemplateNew; fall back
    // to systemPromptOld / systemPromptNew for back-compat with legacy
    // renderOnly steps that store the template as the system prompt.
    const template =
      (flowType === "old" ? step.renderTemplateOld : step.renderTemplateNew) ??
      (flowType === "old" ? step.systemPromptOld   : step.systemPromptNew) ?? "";
    if (!template) return;

    // Build the input values map and bail if any required input is missing.
    const effectiveInputs: Record<string, string> = {};
    let missingRequired = false;
    for (const inputDef of step.inputs) {
      const v = getEffectiveInputValue(inputDef.name, stepState, sourceResolved);
      effectiveInputs[inputDef.name] = v;
      if (inputDef.required && !v.trim()) missingRequired = true;
    }
    if (missingRequired) return;

    const rendered = interpolate(template, effectiveInputs).trim();
    if (!rendered) return;

    // Skip if the cell already shows this exact output (avoids a render
    // loop) or if the user has manually pinned a different value.
    if (stepState.isOutputOverride) return;
    if ((stepState.output ?? "").trim() === rendered) return;

    dispatch({
      type: "SET_STEP_RUN_OUTPUT",
      clientId, flowType, flowIndex,
      stepName: step.name,
      output: rendered,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step.renderOnly,
    step.systemPromptOld,
    step.systemPromptNew,
    step.renderTemplateOld,
    step.renderTemplateNew,
    flowType,
    // Re-run whenever any source-resolved input value changes (e.g.
    // picker output changes → upstream step_output.field re-resolves).
    JSON.stringify(sourceResolved),
    stepState.output,
    stepState.isOutputOverride,
    stepState.status,
    disabled,
  ]);

  const requiredInputsMissing = step.inputs
    .filter((i) => i.required)
    .some((i) => getEffectiveInputValue(i.name, stepState, sourceResolved).trim() === "");

  // ── Effective prompts (override OR template) ───────────────────────────────
  // Per-flow user templates fall back to the shared one. Lets a step
  // (e.g. Build Image Prompt for service/category) send a different
  // user payload per flow — old = just description, new = description +
  // business_context + company_info.
  const userTemplateForFlow =
    (flowType === "old" ? step.userPromptTemplateOld : step.userPromptTemplateNew) ??
    step.userPromptTemplate;
  const hasPromptTemplate = !!(
    (flowType === "old" ? step.systemPromptOld : step.systemPromptNew) ||
    userTemplateForFlow
  );
  const hasPromptOverride = !!stepState.promptOverride;

  const effectivePrompts = useMemo(() => {
    if (stepState.promptOverride) {
      return {
        systemPrompt: stepState.promptOverride.systemPrompt,
        userPrompt:   stepState.promptOverride.userPrompt,
      };
    }
    const effectiveInputs = Object.fromEntries(
      step.inputs.map((i) => [
        i.name,
        getEffectiveInputValue(i.name, stepState, sourceResolved),
      ])
    );
    const vars = prepareLLMVars(effectiveInputs);

    const systemTemplate =
      (flowType === "old" ? step.systemPromptOld : step.systemPromptNew) ?? "";

    // renderOnly step: the "prompt" is just the interpolated template; no
    // user-prompt pairing since nothing runs through an LLM.
    if (step.renderOnly) {
      const rendered = systemTemplate ? interpolate(systemTemplate, vars) : "";
      return { systemPrompt: rendered, userPrompt: "" };
    }

    const systemPrompt = systemTemplate ? interpolate(systemTemplate, vars) : "";
    const userPrompt = userTemplateForFlow
      ? interpolate(userTemplateForFlow, vars)
      : Object.entries(effectiveInputs)
          .map(([k, v]) => `${k}:\n${v}`)
          .join("\n\n");
    return { systemPrompt, userPrompt };
  }, [step, flowType, stepState, sourceResolved]);

  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  // Holds the AbortController for the step's in-flight run, so the Stop
  // button can cancel it. Cleared on completion / failure / unmount.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => {
    // Unmount cleanup — cancel any in-flight request.
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  function handleStop() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  // ---------------------------------------------------------------------------
  // Run handler
  // ---------------------------------------------------------------------------
  async function handleRun(opts?: { systemPrompt?: string; userPrompt?: string }) {
    if (stepState.isOutputOverride) return;
    if (disabled) return;

    const effectiveInputs = Object.fromEntries(
      step.inputs.map((i) => [
        i.name,
        getEffectiveInputValue(i.name, stepState, sourceResolved),
      ])
    );

    // Cancel any previous in-flight run before starting a new one.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "SET_STEP_STATUS", clientId, flowType, flowIndex, stepName: step.name, status: "running" });

    try {
      const result = await runStep({
        pageType, imageType, flowType, step,
        resolvedInputs: effectiveInputs,
        aspectRatio:
          isImageGenStep(step.name)
            ? (resolveFixedAspectRatio(step, flowType) ?? effectiveInputs["aspect_ratio"] ?? defaultAspectRatio)
            : undefined,
        clientId,
        pipelineKey,
        systemPromptOverride: opts?.systemPrompt ?? stepState.promptOverride?.systemPrompt,
        userPromptOverride:   opts?.userPrompt   ?? stepState.promptOverride?.userPrompt,
        stepConfig: stepState.stepConfig,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return; // Aborted — abort handler already dispatched.
      if (result.status === "completed") {
        dispatch({ type: "SET_STEP_RUN_OUTPUT", clientId, flowType, flowIndex, stepName: step.name, output: result.output, warning: result.warning });
      } else {
        dispatch({ type: "SET_STEP_ERROR", clientId, flowType, flowIndex, stepName: step.name, error: result.error ?? "Unknown error" });
      }
    } catch (err) {
      const isAbort =
        err instanceof DOMException && err.name === "AbortError" ||
        (err instanceof Error && /aborted/i.test(err.message));
      dispatch({
        type: "SET_STEP_ERROR",
        clientId, flowType, flowIndex, stepName: step.name,
        error: isAbort ? "Stopped by user." : (err instanceof Error ? err.message : String(err)),
      });
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  // ── Output rendering ─────────────────────────────────────────────────────
  // If step declares outputFields, parse output JSON and render each key
  // separately. Falls back to the single-field layout when parsing fails.
  const parsedOutput = useMemo<Record<string, unknown> | null>(() => {
    if (!step.outputFields || !stepState.output) return null;
    try {
      const v = JSON.parse(stepState.output);
      return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }, [step.outputFields, stepState.output]);

  function updateOutputField(fieldName: string, newValue: string) {
    // Preserve any fields we don't know about; replace the edited one.
    const base = parsedOutput ?? {};
    let stored: unknown = newValue;
    // If the sub-field is JSON, try to parse so we don't double-encode strings.
    const fieldDef = step.outputFields?.find((f) => f.name === fieldName);
    if (fieldDef?.outputType === "json") {
      try { stored = JSON.parse(newValue); } catch { stored = newValue; }
    }
    const next = { ...base, [fieldName]: stored };
    dispatch({
      type: "UPDATE_STEP_OUTPUT", clientId, flowType, flowIndex, stepName: step.name,
      output: JSON.stringify(next, null, 2),
    });
  }

  function subFieldValue(fieldName: string, subOutputType: string): string {
    if (!parsedOutput) return "";
    const raw = parsedOutput[fieldName];
    if (raw === undefined || raw === null) return "";
    if (typeof raw === "string") return raw;
    return subOutputType === "json" ? JSON.stringify(raw, null, 2) : String(raw);
  }

  const cellBorderClass = isFailed ? "border-l-2 border-l-red-600/50" : "border-l border-neutral-800";
  const cellBgClass     = isFailed ? "bg-red-950/20" : "";

  return (
    <td
      rowSpan={rowSpan}
      className={`align-top p-0 min-w-[360px] max-w-[360px] ${cellBorderClass} ${cellBgClass}`}
    >
      <div className="flex flex-col h-full">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        {/* Hide the header entirely when the step is both skipped for
         *  this flow AND hideWhenSkipped. Together with the empty body
         *  below it, the cell becomes effectively invisible (just an
         *  empty TD that holds the column's width). */}
        {!(isSkipped && step.hideWhenSkipped) && (
        <div className={`flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-neutral-900/50 flex-wrap ${
          disabled ? "opacity-50" : ""
        }`}>
          <StatusDot status={(isSkipped || disabled) ? "idle" : stepState.status} />
          <span className="text-xs font-semibold text-neutral-200 truncate flex-1">{step.title}</span>
          {isImageGenStep(step.name) && (
            <span className="text-[9px] font-mono text-neutral-500 px-1.5 py-0.5 bg-neutral-800 rounded">
              {resolveFixedAspectRatio(step, flowType) ?? defaultAspectRatio}
            </span>
          )}
          {/* Generate Image in the new flow exposes a model picker, so
           *  a hard-coded model pill in the header would contradict
           *  whatever the user selected. Hide the pill for every new-
           *  flow image-gen cell (all page types, all three step names).
           *  Old-flow rows still show the label since they always run
           *  the default model — no picker there. */}
          {!(isImageGenStep(step.name) && flowType === "new") && (
            <span className={`text-[9px] font-mono ${PROVIDER_COLOR[step.provider] ?? "text-neutral-500"}`}>
              {step.model}
            </span>
          )}
          {/* Diff badges compare new flow to old flow, so they're only
           *  meaningful on the old-flow row. Hiding them on new-flow rows
           *  keeps the header clean — users already know they're on the
           *  new flow from the "NEW" label on the left. */}
          {flowType === "old" && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {isSkipped ? (
          step.hideWhenSkipped ? (
            // Step asked to be invisible when skipped for this flow —
            // render a minimal-height blank body so the table column
            // alignment survives but no placeholder text shows.
            <div className="flex-1 px-3 py-2" />
          ) : (
            <div className="flex items-center justify-center flex-1 px-3 py-8">
              <span className="text-[11px] text-neutral-700 italic">— Not in {flowType === "old" ? "Old" : "New"} Flow —</span>
            </div>
          )
        ) : disabled ? (
          // Gated off because the client's required page-topic context is
          // empty (no PUBLISHED service/category cluster with an image
          // description). See getDisabledStepsForFlow.
          <div className="flex items-center justify-center flex-1 px-3 py-8">
            <span className="text-[11px] text-neutral-700 italic text-center">
              {(() => {
                const pageNoun =
                  pageType === "service"  ? "service page"  :
                  pageType === "category" ? "category page" :
                                            "page";
                const prefix = flowType === "old" ? "Old flow disabled" : "Disabled";
                return `— ${prefix}: no ${pageNoun} is available for this client —`;
              })()}
            </span>
          </div>
        ) : step.picker ? (
          // ── Picker body: selectable cards of pre-fetched descriptions ────
          // One step shared across old + new flow. No LLM, no Run button.
          // Clicking a card commits that option as the step's output, which
          // flows straight into the downstream Build Image Prompt step.
          <div className="flex flex-col gap-3 p-3 flex-1">
            <span className="text-[9px] uppercase tracking-widest text-neutral-600">
              Image Description Options
            </span>
            {pickerOptions && pickerOptions.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {pickerOptions.map((opt, i) => {
                  const isSelected = (stepState.output ?? "") === opt;
                  // Truncate non-selected cards to 2 lines so long descriptions
                  // don't blow out the cell. Selected card expands to full text
                  // so the user can see exactly what's feeding downstream.
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const action = sharedAcrossFlows
                          ? { type: "SET_SHARED_STEP_OUTPUT" as const, clientId, stepName: step.name, output: opt }
                          : { type: "SET_STEP_RUN_OUTPUT" as const, clientId, flowType, flowIndex, stepName: step.name, output: opt };
                        dispatch(action);
                      }}
                      title={isSelected ? undefined : "Click to select (expands to full text)"}
                      className={`text-left p-2 rounded border text-[11px] font-mono leading-relaxed transition-colors
                        ${isSelected
                          ? "border-violet-500 bg-violet-950/30 text-neutral-100"
                          : "border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                        }`}
                    >
                      <span className="text-[9px] uppercase tracking-widest text-violet-400/80 mr-2 font-sans">
                        {isSelected
                          ? (i === 0 ? "● Default" : "● Selected")
                          : `Option ${i + 1}`}
                      </span>
                      <span
                        className={isSelected ? "" : "line-clamp-2"}
                        style={isSelected ? undefined : {
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const,
                          overflow: "hidden",
                        }}
                      >
                        {pickerLabelFor(opt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              !step.pickerAllowCustom && (
                <div className="py-4 text-center text-[11px] italic text-neutral-700">
                  No description options available for this client.
                </div>
              )
            )}

            {/* Free-text description — only when pickerAllowCustom. Typed
             *  text is written straight into the step output (shared
             *  across flows), overriding any selected option card. */}
            {step.pickerAllowCustom && (
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-600">
                  Or type a custom description
                </span>
                <textarea
                  value={stepState.output ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    const action = sharedAcrossFlows
                      ? { type: "SET_SHARED_STEP_OUTPUT" as const, clientId, stepName: step.name, output: v }
                      : { type: "SET_STEP_RUN_OUTPUT" as const, clientId, flowType, flowIndex, stepName: step.name, output: v };
                    dispatch(action);
                  }}
                  rows={3}
                  placeholder="Type an image description here — fed into Generate Image Prompt for both flows."
                  className="w-full text-[11px] font-mono text-neutral-200 leading-relaxed
                    bg-neutral-950 border border-neutral-700 rounded p-2 resize-y
                    focus:outline-none focus:ring-1 focus:ring-violet-500
                    min-h-[60px] max-h-[200px]"
                  spellCheck={false}
                />
              </div>
            )}

            <p className="text-[10px] text-neutral-600 leading-relaxed">
              Selected/typed description flows into <span className="text-neutral-400">Generate Image Prompt</span>.
              {pickerOptions && pickerOptions.length > 0
                ? " First option is the default — click another card or type in the text area to override."
                : step.pickerAllowCustom
                  ? " No preset options for this client yet — type your own above."
                  : ""}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-3 flex-1">

            {/* Inputs — filtered to those that apply to this flow.
             *  When a step input declares `flows: ["new"]` (or "old"),
             *  it's hidden from the other flow's cell so the UI only
             *  shows fields whose values actually feed this flow's run. */}
            {(() => {
              const visibleInputs = step.inputs.filter(
                (i) => !i.flows || i.flows.includes(flowType),
              );
              if (visibleInputs.length === 0) return null;
              return (
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-600">Inputs</span>
                {visibleInputs.map((inputDef) => {
                  const isOverridden = !!stepState.inputOverrides[inputDef.name];
                  const displayVal = getEffectiveInputValue(inputDef.name, stepState, sourceResolved);

                  return (
                    <CollapsibleField
                      key={inputDef.name}
                      label={`${inputDef.label}${inputDef.required ? "" : " (opt)"}`}
                      value={displayVal}
                      readOnly={false}
                      options={inputDef.options}
                      isManualOverride={isOverridden}
                      overrideBadgeLabel="OVERRIDE"
                      overrideBadgeTooltip="Input manually overridden. Click 'Reset to upstream' to use the live source value."
                      resetOverrideLabel="Reset to upstream"
                      onChange={(v) =>
                        dispatch({
                          type: "UPDATE_STEP_INPUT", clientId, flowType, flowIndex,
                          stepName: step.name, inputName: inputDef.name, value: v,
                        })
                      }
                      onResetOverride={() =>
                        dispatch({
                          type: "RESET_STEP_INPUT_OVERRIDE", clientId, flowType, flowIndex,
                          stepName: step.name, inputName: inputDef.name,
                        })
                      }
                      placeholder="—"
                    />
                  );
                })}
              </div>
              );
            })()}

            {/* ── Image model picker (image-gen steps, new flow only) ── */}
            {isImageGenStep(step.name) && flowType === "new" && (
              <ImageModelPicker
                config={stepState.stepConfig}
                pageType={pageType}
                imageType={imageType}
                onChange={(patch) =>
                  dispatch({
                    type: "UPDATE_STEP_CONFIG",
                    clientId, flowType, flowIndex,
                    stepName: step.name,
                    config: patch,
                  })
                }
              />
            )}

            {/* ── View Prompt CTA (LLM steps only) ──────────────────────── */}
            {hasPromptTemplate && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPromptDialogOpen(true)}
                  className="px-2 py-1 text-[10px] rounded border border-neutral-700
                    bg-neutral-800/60 text-neutral-300 hover:text-violet-300 hover:border-violet-600/50
                    transition-colors flex items-center gap-1.5"
                  title={
                    flowType === "old"
                      ? "Old-flow prompt is the frozen stormbreaker baseline — view only"
                      : "View the exact prompt being sent. Edit to iterate."
                  }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {flowType === "old" ? "View Prompt" : "View / Edit Prompt"}
                </button>
                {flowType === "new" && hasPromptOverride && (
                  <span
                    title="Prompt has been edited. Running this step uses the edited version."
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-400"
                  >
                    PROMPT EDITED
                  </span>
                )}
              </div>
            )}

            {/* ── Output ────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-neutral-600">Output</span>

              {isFailed && (
                <div className="flex items-start gap-2 p-2 bg-red-900/30 border border-red-600/40 rounded text-red-200">
                  <ErrorIcon />
                  <div>
                    <div className="font-semibold text-xs">Step Failed</div>
                    <div className="text-red-300 font-mono text-[10px] mt-1 break-all">
                      {stepState.error ?? stepState.output ?? "Unknown error"}
                    </div>
                  </div>
                </div>
              )}

              {!isFailed && stepState.warning && (
                <div className="flex items-start gap-2 px-2 py-1.5 bg-amber-900/20 border border-amber-700/40 rounded text-amber-200 text-[10px]">
                  <span aria-hidden="true" className="mt-[1px]">⚠</span>
                  <span className="font-mono break-all">{stepState.warning}</span>
                </div>
              )}

              {!isFailed && step.outputFields && parsedOutput ? (
                // Multi-field output: render each declared field as its own block
                <div className="flex flex-col gap-2">
                  {step.outputFields.map((f) => (
                    <CollapsibleField
                      key={f.name}
                      label={f.label}
                      value={subFieldValue(f.name, f.outputType)}
                      readOnly={false}
                      outputType={f.outputType}
                      isManualOverride={stepState.isOutputOverride}
                      overrideBadgeLabel="EDITED"
                      overrideBadgeTooltip="Output manually edited. Re-running this step is disabled until you reset."
                      resetOverrideLabel="Reset Override"
                      onChange={(v) => updateOutputField(f.name, v)}
                      onResetOverride={() =>
                        dispatch({ type: "RESET_STEP_OVERRIDE", clientId, flowType, flowIndex, stepName: step.name })
                      }
                      placeholder={isRunning ? "Running…" : "—"}
                    />
                  ))}
                </div>
              ) : !isFailed && (
                <CollapsibleField
                  label="Result"
                  value={stepState.output}
                  readOnly={false}
                  isManualOverride={stepState.isOutputOverride}
                  overrideBadgeLabel="EDITED"
                  overrideBadgeTooltip="Output manually edited. Re-running this step is disabled until you reset."
                  resetOverrideLabel="Reset Override"
                  onChange={(v) =>
                    dispatch({ type: "UPDATE_STEP_OUTPUT", clientId, flowType, flowIndex, stepName: step.name, output: v })
                  }
                  onResetOverride={() =>
                    dispatch({ type: "RESET_STEP_OVERRIDE", clientId, flowType, flowIndex, stepName: step.name })
                  }
                  outputType={step.outputType}
                  placeholder={isRunning ? "Running…" : "—"}
                />
              )}
            </div>

            {/* Run / Stop buttons */}
            <div className="mt-auto flex items-center gap-2 self-start">
              {isRunning ? (
                <>
                  <button
                    onClick={handleStop}
                    title="Abort the in-flight request. Server-side provider call may still complete in the background."
                    className="px-3 py-1.5 text-xs rounded bg-red-700 text-white hover:bg-red-600
                      transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-sm bg-white" />
                    Stop
                  </button>
                  <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    Running…
                  </span>
                </>
              ) : (
                <button
                  onClick={() => handleRun()}
                  disabled={requiredInputsMissing || stepState.isOutputOverride}
                  title={stepState.isOutputOverride ? "Output manually overridden — reset to re-run" : undefined}
                  className="px-3 py-1.5 text-xs rounded bg-violet-700 text-white hover:bg-violet-600
                    disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {stepState.isOutputOverride ? "🔒 Overridden" : "▶ Run Step"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Prompt Dialog ─────────────────────────────────────────────── */}
      {hasPromptTemplate && (
        <PromptDialog
          isOpen={promptDialogOpen}
          stepTitle={step.title}
          flowLabel={
            flowType === "old"
              ? "Old flow"
              : flowIndex === 0 ? "New flow" : `New flow ${flowIndex + 1}`
          }
          initialSystemPrompt={effectivePrompts.systemPrompt}
          initialUserPrompt={effectivePrompts.userPrompt}
          hasOverride={hasPromptOverride}
          readOnly={flowType === "old"}
          onCancel={() => setPromptDialogOpen(false)}
          onSave={(sys, usr) => {
            dispatch({
              type: "SET_STEP_PROMPT_OVERRIDE", clientId, flowType, flowIndex,
              stepName: step.name, systemPrompt: sys, userPrompt: usr,
            });
            setPromptDialogOpen(false);
          }}
          onSaveAndRun={(sys, usr) => {
            dispatch({
              type: "SET_STEP_PROMPT_OVERRIDE", clientId, flowType, flowIndex,
              stepName: step.name, systemPrompt: sys, userPrompt: usr,
            });
            setPromptDialogOpen(false);
            void handleRun({ systemPrompt: sys, userPrompt: usr });
          }}
          onResetToDefault={() => {
            dispatch({
              type: "RESET_STEP_PROMPT_OVERRIDE", clientId, flowType, flowIndex, stepName: step.name,
            });
            setPromptDialogOpen(false);
          }}
        />
      )}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Image model picker — generate_image step, new flow only. Per-lane state
// lives in StepState.stepConfig and is sent to the API via runStep.
// ---------------------------------------------------------------------------
type ImageModelId =
  | "google/nano-banana-pro"
  | "google/nano-banana-2"
  | "bytedance/seedream-4"
  | "openai/gpt-image-2"
  | "black-forest-labs/flux-2-flex";

const IMAGE_MODELS: Array<{
  id: ImageModelId;
  label: string;
  price: string;
}> = [
  { id: "google/nano-banana-pro",     label: "nano-banana-pro", price: "$0.15 / image · 2K" },
  { id: "google/nano-banana-2",       label: "nano-banana-2",   price: "$0.101 / image · 2K" },
  { id: "bytedance/seedream-4",       label: "seedream-4",      price: "$0.03 / image · 2K" },
  { id: "openai/gpt-image-2",         label: "gpt-image-2",     price: "$0.128 / image" },
  { id: "black-forest-labs/flux-2-flex", label: "flux-2-flex",  price: "1 MP · steps=30" },
];

/**
 * Per-pipeline allow-list. Keeps model options relevant to the page
 * type the user is working in:
 *   - gpt-image-2 is only useful for service / category pages (its
 *     strict 1:1/3:2/2:3 aspect enum doesn't fit blog sizes cleanly).
 *   - flux-2-flex is a blog-infographic-only variant for now (the
 *     reference cURL the team is evaluating against).
 *   - Everything else is available everywhere.
 */
function isModelAllowedFor(
  id: ImageModelId,
  pageType: PageType,
  imageType: ImageType,
): boolean {
  if (id === "openai/gpt-image-2") {
    return pageType === "service" || pageType === "category";
  }
  if (id === "black-forest-labs/flux-2-flex") {
    return pageType === "blog" && imageType === "infographic";
  }
  return true;
}

function ImageModelPicker({
  config,
  pageType,
  imageType,
  onChange,
}: {
  config: Record<string, unknown> | undefined;
  pageType: PageType;
  imageType: ImageType;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const visibleModels = IMAGE_MODELS.filter((m) =>
    isModelAllowedFor(m.id, pageType, imageType),
  );

  const configured =
    typeof config?.model === "string" &&
    IMAGE_MODELS.some((m) => m.id === config.model)
      ? (config.model as ImageModelId)
      : null;

  const selected: ImageModelId =
    configured && visibleModels.some((m) => m.id === configured)
      ? configured
      : "google/nano-banana-pro";

  // If the saved model isn't valid for this pipeline (e.g. user had
  // gpt-image-2 selected, then switched Page Type to blog), snap the
  // stored config back to the default so the backend + UI agree.
  useEffect(() => {
    if (configured && !visibleModels.some((m) => m.id === configured)) {
      onChange({ model: "google/nano-banana-pro" });
    }
  }, [configured, visibleModels, onChange]);

  const imageSearch  = typeof config?.imageSearch  === "boolean" ? config.imageSearch  : false;
  const googleSearch = typeof config?.googleSearch === "boolean" ? config.googleSearch : false;

  return (
    <div className="flex flex-col gap-1.5 rounded border border-indigo-900/40 bg-indigo-950/20 p-2">
      <span className="text-[9px] uppercase tracking-widest text-indigo-300/80">
        Model
      </span>

      <div className="flex flex-col gap-1">
        {visibleModels.map((m) => {
          const isActive = m.id === selected;
          return (
            <label
              key={m.id}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-[11px] transition-colors ${
                isActive
                  ? "bg-indigo-900/40 border border-indigo-700/60"
                  : "hover:bg-indigo-900/20 border border-transparent"
              }`}
            >
              <input
                type="radio"
                checked={isActive}
                onChange={() => onChange({ model: m.id })}
                className="accent-indigo-500"
              />
              <span className="text-neutral-200 font-mono flex-1 min-w-0 truncate">{m.label}</span>
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">{m.price}</span>
            </label>
          );
        })}
      </div>

      {/* nano-banana-2 extras: image_search + google_search toggles */}
      {selected === "google/nano-banana-2" && (
        <div className="flex flex-col gap-1 pl-2 pt-1 border-t border-indigo-900/40 mt-1">
          <label className="flex items-center gap-2 text-[10px] text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={imageSearch}
              onChange={(e) => onChange({ imageSearch: e.target.checked })}
              className="accent-indigo-500"
            />
            <span className="font-mono">image_search</span>
            <span className="text-neutral-500">
              — Google Image Search grounding (web search also enabled)
            </span>
          </label>
          <label className="flex items-center gap-2 text-[10px] text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={googleSearch}
              onChange={(e) => onChange({ googleSearch: e.target.checked })}
              className="accent-indigo-500"
            />
            <span className="font-mono">google_search</span>
            <span className="text-neutral-500">
              — real-time web grounding (weather, sports, news)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
