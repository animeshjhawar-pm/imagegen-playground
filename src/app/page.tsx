"use client";

import { useEffect, useRef, useState } from "react";
import { PlaygroundProvider, usePlayground } from "@/context/PlaygroundContext";
import type { ClientState, FlowState, StepState } from "@/state/playgroundReducer";
import { TopControlBar } from "@/components/TopControlBar";
import { PipelineTable } from "@/components/PipelineTable";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmRunAllModal } from "@/components/ConfirmRunAllModal";
import { PIPELINES, getDisabledStepsForFlow } from "@/config/pipelines";
import { runStep } from "@/lib/runStep";
import { resolveInputs } from "@/lib/resolveInputs";
import { estimateCost } from "@/lib/costEstimates";

export default function PlaygroundPage() {
  return (
    <PlaygroundProvider>
      <PlaygroundInner />
    </PlaygroundProvider>
  );
}

/**
 * Overlay a lane's in-flight step outputs on top of a client's committed
 * stepStates so `resolveInputs` sees the freshest values without waiting
 * for React to commit the dispatch that stored them. The returned client
 * is a structural copy — safe to pass into resolveInputs as if it were
 * the real state.
 */
function patchClientWithLaneOutputs(
  client: ClientState,
  flowType: "old" | "new",
  flowIndex: number,
  laneOutputs: Record<string, string>,
): ClientState {
  if (Object.keys(laneOutputs).length === 0) return client;

  const overlay = (existing: Record<string, StepState>): Record<string, StepState> => {
    const next: Record<string, StepState> = { ...existing };
    for (const [name, output] of Object.entries(laneOutputs)) {
      const base: StepState =
        next[name] ?? {
          inputs: {},
          inputOverrides: {},
          output: "",
          lastRunOutput: "",
          status: "idle",
          isOutputOverride: false,
        };
      next[name] = { ...base, output, lastRunOutput: output };
    }
    return next;
  };

  if (flowType === "old") {
    const patched: FlowState = { ...client.oldFlow, stepStates: overlay(client.oldFlow.stepStates) };
    return { ...client, oldFlow: patched };
  }
  return {
    ...client,
    newFlows: client.newFlows.map((f, i) =>
      i === flowIndex ? ({ ...f, stepStates: overlay(f.stepStates) } as FlowState) : f,
    ),
  };
}

function PlaygroundInner() {
  const { state, dispatch } = usePlayground();
  // null = idle; "all" = full Run All in flight; otherwise the step-name
  // being batched across all clients. Mutually exclusive so the UI can't
  // fire two parallel run waves over the same steps.
  const [runningScope, setRunningScope] = useState<null | "all" | string>(null);
  const [pendingConfirm, setPendingConfirm] = useState<{
    stepCount: number;
    estimatedCost: number;
    /** What to execute when the user confirms. */
    onConfirm: () => void;
  } | null>(null);

  const { pageType, imageType, clients } = state;
  const hasSelection = pageType !== null && imageType !== null;
  const isRunning = runningScope !== null;

  // Live-state ref — refreshed on every commit so we can read the latest
  // clients array inside async loops even when the outer closure is stale.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /** Execute a single step for one (client, flow, lane) — shared between
   *  full-pipeline run and per-step run-all. `flowIndex` is 0 for Old (ignored)
   *  and 0-based lane index for New.
   *
   *  `laneOutputs` is a per-lane accumulator that records every step's
   *  output as it completes WITHIN this run. Downstream steps resolve
   *  their inputs against a view of the client that's patched with these
   *  outputs, so Step N+1 always sees Step N's fresh output — regardless
   *  of whether React has committed the dispatch yet. Without this the
   *  loop races: dispatch fires, React schedules a render, but the next
   *  await starts before the render commits, so `stateRef` still holds
   *  the pre-dispatch client and resolveInputs reads "" for Step N's
   *  `step_output`. That caused "Missing final_prompt" on Step 5 + the
   *  empty-inputs extract_graphic_token issue reported afterward.
   */
  async function runOne(
    step: (typeof PIPELINES)[string]["steps"][number],
    clientSnapshot: (typeof clients)[number],
    flowType: "old" | "new",
    flowIndex: number,
    pipelineKey: string,
    defaultAspectRatio: string,
    laneOutputs: Record<string, string> = {},
  ): Promise<"completed" | "failed" | "skipped"> {
    // Start from the latest committed client, then overlay this lane's
    // in-flight outputs. Belt-and-suspenders against React batching.
    const latestClient =
      stateRef.current.clients.find((c) => c.id === clientSnapshot.id) ?? clientSnapshot;
    const client = patchClientWithLaneOutputs(
      latestClient,
      flowType,
      flowIndex,
      laneOutputs,
    );

    const diff = flowType === "old" ? step.diffOld : step.diffNew;
    if (diff === "skipped") return "skipped";

    // Picker steps carry no provider call; their output is set directly
    // by the user (or auto-initialised to options[0]). Running them would
    // clobber the picked description with the raw options JSON via the
    // renderOnly template, so skip from Run-All / Run-Step-Name entirely.
    if (step.picker) return "skipped";

    // Skip any step the UI has greyed out (e.g. service/category pipelines
    // for clients without a prefetched topic). Same rule both flows.
    const disabledSteps = getDisabledStepsForFlow(pipelineKey, client.context, flowType);
    if (disabledSteps.has(step.name)) return "skipped";

    const flow =
      flowType === "old"
        ? client.oldFlow
        : client.newFlows[flowIndex];
    if (!flow) return "skipped";
    const stepState = flow.stepStates[step.name];
    if (stepState?.isOutputOverride && stepState.output) {
      // Manually-overridden output — honor it, treat as completed so the
      // chain continues against the user's pinned value.
      laneOutputs[step.name] = stepState.output;
      return "completed";
    }

    dispatch({
      type: "SET_STEP_STATUS",
      clientId: client.id,
      flowType,
      flowIndex,
      stepName: step.name,
      status: "running",
    });

    const resolved = resolveInputs(step, client, flowType, imageType ?? undefined, flowIndex);

    // Fold any per-input user overrides back in so Run-All respects the
    // same dropdown choices (e.g. aspect_ratio) as per-step runs.
    const effectiveInputs = Object.fromEntries(
      step.inputs.map((i) => {
        const overridden = stepState?.inputOverrides?.[i.name]
          ? stepState.inputs[i.name] ?? ""
          : resolved[i.name] ?? "";
        return [i.name, overridden];
      })
    );

    try {
      const result = await runStep({
        pageType: pageType!,
        imageType: imageType!,
        flowType,
        step,
        resolvedInputs: effectiveInputs,
        aspectRatio:
          step.name === "generate_image"
            ? (effectiveInputs["aspect_ratio"] || defaultAspectRatio)
            : undefined,
        clientId: client.id,
        pipelineKey,
      });

      if (result.status === "completed") {
        // Guard against a 200-with-empty-string completion — treat as a
        // failure so the lane stops instead of cascading "Missing …"
        // errors into every downstream step.
        if (!result.output || !result.output.trim()) {
          dispatch({
            type: "SET_STEP_ERROR",
            clientId: client.id,
            flowType,
            flowIndex,
            stepName: step.name,
            error:
              "Step returned an empty output. Upstream provider succeeded but produced no usable content — check the step's inputs and re-run.",
          });
          return "failed";
        }
        // Record into the lane accumulator FIRST so the next iteration's
        // resolveInputs sees this output without waiting on React commit.
        laneOutputs[step.name] = result.output;
        dispatch({
          type: "SET_STEP_RUN_OUTPUT",
          clientId: client.id,
          flowType,
          flowIndex,
          stepName: step.name,
          output: result.output,
          warning: result.warning,
        });
        return "completed";
      }
      dispatch({
        type: "SET_STEP_ERROR",
        clientId: client.id,
        flowType,
        flowIndex,
        stepName: step.name,
        error: result.error ?? "Unknown error",
      });
      return "failed";
    } catch (err) {
      dispatch({
        type: "SET_STEP_ERROR",
        clientId: client.id,
        flowType,
        flowIndex,
        stepName: step.name,
        error: err instanceof Error ? err.message : String(err),
      });
      return "failed";
    }
  }

  async function executeRunAll(scope: StepRunScope = "both") {
    if (!hasSelection || clients.length === 0 || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;

    const pipelineKey = `${pageType}:${imageType}`;

    setRunningScope("all");
    try {
      // Clients parallel, flows parallel (Old + every New lane), steps serial
      // (Step N+1 reads Step N's output via resolveInputs).
      await Promise.all(
        clients.map((client) => {
          const allLanes: Array<{ flowType: "old" | "new"; flowIndex: number }> = [
            { flowType: "old", flowIndex: 0 },
            ...client.newFlows.map((_, i) => ({ flowType: "new" as const, flowIndex: i })),
          ];
          const lanes = allLanes.filter((l) =>
            scope === "both" ? true : scope === "old" ? l.flowType === "old" : l.flowType === "new",
          );
          return Promise.all(
            lanes.map(async ({ flowType, flowIndex }) => {
              const ar =
                (flowType === "old"
                  ? pipeline.defaultAspectRatioOld
                  : pipeline.defaultAspectRatioNew) ?? pipeline.defaultAspectRatio;
              // Fresh per-lane accumulator. Each step's output is written
              // here as it completes, so the next step's resolveInputs
              // sees it regardless of React commit timing.
              const laneOutputs: Record<string, string> = {};
              for (const step of pipeline.steps) {
                const outcome = await runOne(
                  step, client, flowType, flowIndex, pipelineKey, ar, laneOutputs,
                );
                // Halt this lane as soon as a step fails — pressing on
                // would cascade "Missing X" errors into every downstream
                // step, burning API calls and making it harder to spot
                // the real failure. The failing cell already shows the
                // error; the user can fix it and re-run.
                if (outcome === "failed") break;
              }
            })
          );
        })
      );
    } finally {
      setRunningScope(null);
    }
  }

  /** `scope` restricts which flow rows this step runs against:
   *    "both" — old + every new lane (original default)
   *    "old"  — old flow only
   *    "new"  — every new lane only
   */
  type StepRunScope = "both" | "old" | "new";

  async function executeRunStep(stepName: string, scope: StepRunScope = "both") {
    if (!hasSelection || clients.length === 0 || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;
    const step = pipeline.steps.find((s) => s.name === stepName);
    if (!step) return;

    const pipelineKey = `${pageType}:${imageType}`;

    setRunningScope(stepName);
    try {
      await Promise.all(
        clients.map((client) => {
          const allLanes: Array<{ flowType: "old" | "new"; flowIndex: number }> = [
            { flowType: "old", flowIndex: 0 },
            ...client.newFlows.map((_, i) => ({ flowType: "new" as const, flowIndex: i })),
          ];
          const lanes = allLanes.filter((l) =>
            scope === "both" ? true : scope === "old" ? l.flowType === "old" : l.flowType === "new",
          );
          return Promise.all(
            lanes.map(({ flowType, flowIndex }) => {
              const ar =
                (flowType === "old"
                  ? pipeline.defaultAspectRatioOld
                  : pipeline.defaultAspectRatioNew) ?? pipeline.defaultAspectRatio;
              return runOne(step, client, flowType, flowIndex, pipelineKey, ar);
            })
          );
        })
      );
    } finally {
      setRunningScope(null);
    }
  }

  /** Run every step for a single (client, flow, lane) left-to-right with
   *  the same fail-stop + lane-outputs accumulator the pipeline-wide Run
   *  All uses. Invoked by the per-row "▶ Run row" button. */
  async function executeRunRow(
    clientId: string,
    flowType: "old" | "new",
    flowIndex: number,
  ): Promise<void> {
    if (!hasSelection || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;
    const client = stateRef.current.clients.find((c) => c.id === clientId);
    if (!client) return;

    const pipelineKey = `${pageType}:${imageType}`;
    const ar =
      (flowType === "old"
        ? pipeline.defaultAspectRatioOld
        : pipeline.defaultAspectRatioNew) ?? pipeline.defaultAspectRatio;

    setRunningScope(`row:${clientId}:${flowType}:${flowIndex}`);
    try {
      const laneOutputs: Record<string, string> = {};
      for (const step of pipeline.steps) {
        const outcome = await runOne(
          step, client, flowType, flowIndex, pipelineKey, ar, laneOutputs,
        );
        if (outcome === "failed") break;
      }
    } finally {
      setRunningScope(null);
    }
  }

  function handleRunRow(
    clientId: string,
    flowType: "old" | "new",
    flowIndex: number,
  ): void {
    if (!hasSelection || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;
    const client = stateRef.current.clients.find((c) => c.id === clientId);
    if (!client) return;

    const flow =
      flowType === "old" ? client.oldFlow : client.newFlows[flowIndex];
    if (!flow) return;

    const disabledSteps = getDisabledStepsForFlow(
      `${pageType}:${imageType}`, client.context, flowType,
    );
    let stepCount = 0;
    let estimatedCost = 0;
    for (const step of pipeline.steps) {
      const diff = flowType === "old" ? step.diffOld : step.diffNew;
      if (diff === "skipped") continue;
      if (step.picker) continue;
      if (disabledSteps.has(step.name)) continue;
      const stepState = flow.stepStates[step.name];
      if (stepState?.isOutputOverride && stepState.output) continue;
      stepCount += 1;
      estimatedCost += estimateCost(step.name);
    }
    if (stepCount === 0) return;
    setPendingConfirm({
      stepCount,
      estimatedCost,
      onConfirm: () => void executeRunRow(clientId, flowType, flowIndex),
    });
  }

  function handleRunAll(scope: StepRunScope = "both") {
    if (!hasSelection || clients.length === 0 || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;

    // Always confirm first — dry-run mode is gone, every run hits live.
    let stepCount = 0;
    let estimatedCost = 0;
    for (const client of clients) {
      const allLanes: Array<{ flowType: "old" | "new"; flow: typeof client.oldFlow }> = [
        { flowType: "old", flow: client.oldFlow },
        ...client.newFlows.map((f) => ({ flowType: "new" as const, flow: f })),
      ];
      const lanes = allLanes.filter((l) =>
        scope === "both" ? true : scope === "old" ? l.flowType === "old" : l.flowType === "new",
      );
      for (const { flowType, flow } of lanes) {
        const disabledSteps = getDisabledStepsForFlow(
          `${pageType}:${imageType}`, client.context, flowType,
        );
        for (const step of pipeline.steps) {
          const diff = flowType === "old" ? step.diffOld : step.diffNew;
          if (diff === "skipped") continue;
          if (step.picker) continue; // picker = no provider call
          if (disabledSteps.has(step.name)) continue;
          const stepState = flow.stepStates[step.name];
          if (stepState?.isOutputOverride && stepState.output) continue;
          stepCount += 1;
          estimatedCost += estimateCost(step.name);
        }
      }
    }
    setPendingConfirm({
      stepCount,
      estimatedCost,
      onConfirm: () => void executeRunAll(scope),
    });
  }

  function handleRunStep(stepName: string, scope: StepRunScope = "both") {
    if (!hasSelection || clients.length === 0 || isRunning) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;
    const step = pipeline.steps.find((s) => s.name === stepName);
    if (!step) return;

    // Always confirm first — dry-run mode is gone, every run hits live.
    let stepCount = 0;
    let estimatedCost = 0;
    for (const client of clients) {
      const allLanes: Array<{ flowType: "old" | "new"; flow: typeof client.oldFlow }> = [
        { flowType: "old", flow: client.oldFlow },
        ...client.newFlows.map((f) => ({ flowType: "new" as const, flow: f })),
      ];
      const lanes = allLanes.filter((l) =>
        scope === "both" ? true : scope === "old" ? l.flowType === "old" : l.flowType === "new",
      );
      for (const { flowType, flow } of lanes) {
        const diff = flowType === "old" ? step.diffOld : step.diffNew;
        if (diff === "skipped") continue;
        if (step.picker) continue;
        const disabledSteps = getDisabledStepsForFlow(
          `${pageType}:${imageType}`, client.context, flowType,
        );
        if (disabledSteps.has(step.name)) continue;
        const stepState = flow.stepStates[step.name];
        if (stepState?.isOutputOverride && stepState.output) continue;
        stepCount += 1;
        estimatedCost += estimateCost(step.name);
      }
    }
    if (stepCount === 0) return;
    setPendingConfirm({
      stepCount,
      estimatedCost,
      onConfirm: () => void executeRunStep(stepName, scope),
    });
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur px-6 py-5 flex items-center justify-between flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="w-6 h-6 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">
            <path fillRule="evenodd"
              d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
              clipRule="evenodd" />
          </svg>
          <span className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent
            drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            ImageGen
          </span>
          <span className="text-white">Playground</span>
          <span
            title="Internal debugging tool"
            className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide
              bg-neutral-800 border border-neutral-700 text-neutral-400 uppercase"
          >
            Internal · v12.0
          </span>
        </h1>

        <div className="flex items-center gap-5">
          <div className="h-6 w-px bg-neutral-800" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.gushwork.ai/v2/gush_new_logo.svg"
            alt="Gushwork"
            className="h-8 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      </header>

      {/* ── Control bar ────────────────────────────────────────────────────── */}
      <TopControlBar onRunAll={handleRunAll} isRunningAll={isRunning} />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto flex flex-col">
        {!hasSelection ? <EmptyState /> : (
          <PipelineTable
            onRunStep={handleRunStep}
            onRunRow={handleRunRow}
            runningScope={runningScope}
          />
        )}
      </main>

      {/* ── Confirm modal (live mode only) ─────────────────────────────────── */}
      <ConfirmRunAllModal
        isOpen={pendingConfirm !== null}
        stepCount={pendingConfirm?.stepCount ?? 0}
        estimatedCost={pendingConfirm?.estimatedCost ?? 0}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={() => {
          const next = pendingConfirm;
          setPendingConfirm(null);
          next?.onConfirm();
        }}
      />
    </div>
  );
}
