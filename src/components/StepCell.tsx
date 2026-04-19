"use client";

import { useMemo, useState } from "react";
import { usePlayground } from "@/context/PlaygroundContext";
import type { StepDefinition, StepDiff, PageType, ImageType } from "@/config/pipelines";
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

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface StepCellProps {
  step: StepDefinition;
  flowType: "old" | "new";
  clientId: string;
  client: ClientState;
  pageType: PageType;
  imageType: ImageType;
  defaultAspectRatio: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function StepCell({
  step, flowType, clientId, client, pageType, imageType, defaultAspectRatio,
}: StepCellProps) {
  const { dispatch, isDryRun } = usePlayground();
  const pipelineKey = `${pageType}:${imageType}`;

  const flow = flowType === "old" ? client.oldFlow : client.newFlow;
  const stepState: StepState = flow.stepStates[step.name] ?? {
    inputs: {}, inputOverrides: {}, output: "", lastRunOutput: "",
    status: "idle", isOutputOverride: false,
  };

  const sourceResolved = useMemo(
    () => resolveInputs(step, client, flowType),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, client, flowType]
  );

  const diff: StepDiff = flowType === "old" ? step.diffOld : step.diffNew;
  const badge = DIFF_BADGE[diff];
  const isSkipped  = diff === "skipped";
  const isRunning  = stepState.status === "running";
  const isFailed   = stepState.status === "failed";

  const requiredInputsMissing = step.inputs
    .filter((i) => i.required)
    .some((i) => getEffectiveInputValue(i.name, stepState, sourceResolved).trim() === "");

  // ── Effective prompts (override OR template) ───────────────────────────────
  const hasPromptTemplate = !!(
    (flowType === "old" ? step.systemPromptOld : step.systemPromptNew) ||
    step.userPromptTemplate
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
    const userPrompt = step.userPromptTemplate
      ? interpolate(step.userPromptTemplate, vars)
      : Object.entries(effectiveInputs)
          .map(([k, v]) => `${k}:\n${v}`)
          .join("\n\n");
    return { systemPrompt, userPrompt };
  }, [step, flowType, stepState, sourceResolved]);

  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Run handler
  // ---------------------------------------------------------------------------
  async function handleRun(opts?: { systemPrompt?: string; userPrompt?: string }) {
    if (stepState.isOutputOverride) return;

    const effectiveInputs = Object.fromEntries(
      step.inputs.map((i) => [
        i.name,
        getEffectiveInputValue(i.name, stepState, sourceResolved),
      ])
    );

    dispatch({ type: "SET_STEP_STATUS", clientId, flowType, stepName: step.name, status: "running" });

    try {
      const result = await runStep({
        pageType, imageType, flowType, step,
        resolvedInputs: effectiveInputs,
        aspectRatio: step.name === "generate_image" ? defaultAspectRatio : undefined,
        isDryRun,
        clientId,
        pipelineKey,
        systemPromptOverride: opts?.systemPrompt ?? stepState.promptOverride?.systemPrompt,
        userPromptOverride:   opts?.userPrompt   ?? stepState.promptOverride?.userPrompt,
      });
      if (result.status === "completed") {
        dispatch({ type: "SET_STEP_RUN_OUTPUT", clientId, flowType, stepName: step.name, output: result.output });
      } else {
        dispatch({ type: "SET_STEP_ERROR", clientId, flowType, stepName: step.name, error: result.error ?? "Unknown error" });
      }
    } catch (err) {
      dispatch({ type: "SET_STEP_ERROR", clientId, flowType, stepName: step.name, error: err instanceof Error ? err.message : String(err) });
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
      type: "UPDATE_STEP_OUTPUT", clientId, flowType, stepName: step.name,
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
    <td className={`align-top p-0 min-w-[360px] max-w-[360px] ${cellBorderClass} ${cellBgClass}`}>
      <div className="flex flex-col h-full">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 bg-neutral-900/50 flex-wrap">
          <StatusDot status={isSkipped ? "idle" : stepState.status} />
          <span className="text-xs font-semibold text-neutral-200 truncate flex-1">{step.title}</span>
          {step.name === "generate_image" && (
            <span className="text-[9px] font-mono text-neutral-500 px-1.5 py-0.5 bg-neutral-800 rounded">
              {defaultAspectRatio}
            </span>
          )}
          <span className={`text-[9px] font-mono ${PROVIDER_COLOR[step.provider] ?? "text-neutral-500"}`}>
            {step.model}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {isSkipped ? (
          <div className="flex items-center justify-center flex-1 px-3 py-8">
            <span className="text-[11px] text-neutral-700 italic">— Not in Old Flow —</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-3 flex-1">

            {/* Inputs */}
            {step.inputs.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-600">Inputs</span>
                {step.inputs.map((inputDef) => {
                  const isOverridden = !!stepState.inputOverrides[inputDef.name];
                  const displayVal = getEffectiveInputValue(inputDef.name, stepState, sourceResolved);

                  return (
                    <CollapsibleField
                      key={inputDef.name}
                      label={`${inputDef.label}${inputDef.required ? "" : " (opt)"}`}
                      value={displayVal}
                      readOnly={false}
                      isManualOverride={isOverridden}
                      overrideBadgeLabel="OVERRIDE"
                      overrideBadgeTooltip="Input manually overridden. Click 'Reset to upstream' to use the live source value."
                      resetOverrideLabel="Reset to upstream"
                      onChange={(v) =>
                        dispatch({
                          type: "UPDATE_STEP_INPUT", clientId, flowType,
                          stepName: step.name, inputName: inputDef.name, value: v,
                        })
                      }
                      onResetOverride={() =>
                        dispatch({
                          type: "RESET_STEP_INPUT_OVERRIDE", clientId, flowType,
                          stepName: step.name, inputName: inputDef.name,
                        })
                      }
                      placeholder="—"
                    />
                  );
                })}
              </div>
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
                        dispatch({ type: "RESET_STEP_OVERRIDE", clientId, flowType, stepName: step.name })
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
                    dispatch({ type: "UPDATE_STEP_OUTPUT", clientId, flowType, stepName: step.name, output: v })
                  }
                  onResetOverride={() =>
                    dispatch({ type: "RESET_STEP_OVERRIDE", clientId, flowType, stepName: step.name })
                  }
                  outputType={step.outputType}
                  placeholder={isRunning ? "Running…" : "—"}
                />
              )}
            </div>

            {/* Run button */}
            <button
              onClick={() => handleRun()}
              disabled={isRunning || requiredInputsMissing || stepState.isOutputOverride}
              title={stepState.isOutputOverride ? "Output manually overridden — reset to re-run" : undefined}
              className="mt-auto px-3 py-1.5 text-xs rounded bg-violet-700 text-white hover:bg-violet-600
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-start"
            >
              {isRunning ? "Running…" : stepState.isOutputOverride ? "🔒 Overridden" : "▶ Run Step"}
            </button>
          </div>
        )}
      </div>

      {/* ── Prompt Dialog ─────────────────────────────────────────────── */}
      {hasPromptTemplate && (
        <PromptDialog
          isOpen={promptDialogOpen}
          stepTitle={step.title}
          flowLabel={flowType === "old" ? "Old flow" : "New flow"}
          initialSystemPrompt={effectivePrompts.systemPrompt}
          initialUserPrompt={effectivePrompts.userPrompt}
          hasOverride={hasPromptOverride}
          readOnly={flowType === "old"}
          onCancel={() => setPromptDialogOpen(false)}
          onSave={(sys, usr) => {
            dispatch({
              type: "SET_STEP_PROMPT_OVERRIDE", clientId, flowType,
              stepName: step.name, systemPrompt: sys, userPrompt: usr,
            });
            setPromptDialogOpen(false);
          }}
          onSaveAndRun={(sys, usr) => {
            dispatch({
              type: "SET_STEP_PROMPT_OVERRIDE", clientId, flowType,
              stepName: step.name, systemPrompt: sys, userPrompt: usr,
            });
            setPromptDialogOpen(false);
            void handleRun({ systemPrompt: sys, userPrompt: usr });
          }}
          onResetToDefault={() => {
            dispatch({
              type: "RESET_STEP_PROMPT_OVERRIDE", clientId, flowType, stepName: step.name,
            });
            setPromptDialogOpen(false);
          }}
        />
      )}
    </td>
  );
}
