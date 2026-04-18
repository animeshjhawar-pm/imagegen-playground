"use client";

import { useMemo } from "react";
import { usePlayground } from "@/context/PlaygroundContext";
import type { StepDefinition, StepDiff, PageType, ImageType } from "@/config/pipelines";
import type { StepState, ClientState } from "@/state/playgroundReducer";
import { StatusDot } from "./StatusDot";
import { CollapsibleField } from "./CollapsibleField";
import { runStep } from "@/lib/runStep";
import { resolveInputs, getEffectiveInputValue } from "@/lib/resolveInputs";

// ---------------------------------------------------------------------------
// Icons (inline SVG — no lucide-react dep)
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

  // Fix 2: derive source-resolved inputs fresh on every render —
  // when any upstream step output changes, these recompute immediately.
  const sourceResolved = useMemo(
    () => resolveInputs(step, client, flowType),
    // client is the live object from context state
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

  // ---------------------------------------------------------------------------
  // Run handler
  // ---------------------------------------------------------------------------
  async function handleRun() {
    if (stepState.isOutputOverride) return; // output is locked by user

    // Build effective inputs: override wins over source-resolved
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

  // Fix 9: error cell styling
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
                  // Fix 2: display value = override value OR live-resolved value
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

            {/* Output */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-neutral-600">Output</span>

              {/* Error banner */}
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

              {!isFailed && (
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
              onClick={handleRun}
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
    </td>
  );
}
