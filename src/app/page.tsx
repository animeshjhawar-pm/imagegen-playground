"use client";

import { useState } from "react";
import { PlaygroundProvider, usePlayground } from "@/context/PlaygroundContext";
import { TopControlBar } from "@/components/TopControlBar";
import { PipelineTable } from "@/components/PipelineTable";
import { EmptyState } from "@/components/EmptyState";
import { DryRunToggle } from "@/components/DryRunToggle";
import { ConfirmRunAllModal } from "@/components/ConfirmRunAllModal";
import { PIPELINES } from "@/config/pipelines";
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

function PlaygroundInner() {
  const { state, dispatch, isDryRun } = usePlayground();
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<{
    stepCount: number;
    estimatedCost: number;
  } | null>(null);

  const { pageType, imageType, clients } = state;
  const hasSelection = pageType !== null && imageType !== null;

  async function executeRunAll() {
    if (!hasSelection || clients.length === 0 || isRunningAll) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;

    const pipelineKey = `${pageType}:${imageType}`;

    setIsRunningAll(true);
    try {
      for (const client of clients) {
        for (const flowType of ["old", "new"] as const) {
          for (const step of pipeline.steps) {
            const diff = flowType === "old" ? step.diffOld : step.diffNew;
            if (diff === "skipped") continue;

            const flow = flowType === "old" ? client.oldFlow : client.newFlow;
            const stepState = flow.stepStates[step.name];
            if (stepState?.isOutputOverride && stepState.output) continue;

            dispatch({
              type: "SET_STEP_STATUS",
              clientId: client.id,
              flowType,
              stepName: step.name,
              status: "running",
            });

            const resolved = resolveInputs(step, client, flowType, imageType ?? undefined);

            try {
              const result = await runStep({
                pageType: pageType!,
                imageType: imageType!,
                flowType,
                step,
                resolvedInputs: resolved,
                aspectRatio:
                  step.name === "generate_image" ? pipeline.defaultAspectRatio : undefined,
                isDryRun,
                clientId: client.id,
                pipelineKey,
              });

              if (result.status === "completed") {
                dispatch({
                  type: "SET_STEP_RUN_OUTPUT",
                  clientId: client.id,
                  flowType,
                  stepName: step.name,
                  output: result.output,
                });
              } else {
                dispatch({
                  type: "SET_STEP_ERROR",
                  clientId: client.id,
                  flowType,
                  stepName: step.name,
                  error: result.error ?? "Unknown error",
                });
              }
            } catch (err) {
              dispatch({
                type: "SET_STEP_ERROR",
                clientId: client.id,
                flowType,
                stepName: step.name,
                error: err instanceof Error ? err.message : String(err),
              });
            }
          }
        }
      }
    } finally {
      setIsRunningAll(false);
    }
  }

  function handleRunAll() {
    if (!hasSelection || clients.length === 0 || isRunningAll) return;
    const pipeline = PIPELINES[`${pageType}:${imageType}`];
    if (!pipeline) return;

    // Live mode → confirm first, show step count + cost estimate
    if (!isDryRun) {
      let stepCount = 0;
      let estimatedCost = 0;
      for (const client of clients) {
        for (const flowType of ["old", "new"] as const) {
          for (const step of pipeline.steps) {
            const diff = flowType === "old" ? step.diffOld : step.diffNew;
            if (diff === "skipped") continue;
            const flow = flowType === "old" ? client.oldFlow : client.newFlow;
            const stepState = flow.stepStates[step.name];
            if (stepState?.isOutputOverride && stepState.output) continue;
            stepCount += 1;
            estimatedCost += estimateCost(step.name);
          }
        }
      }
      setPendingConfirm({ stepCount, estimatedCost });
      return;
    }

    void executeRunAll();
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
            Internal · v0.1
          </span>
        </h1>

        <div className="flex items-center gap-5">
          <DryRunToggle />
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
      <TopControlBar onRunAll={handleRunAll} isRunningAll={isRunningAll} />

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto flex flex-col">
        {!hasSelection ? <EmptyState /> : <PipelineTable />}
      </main>

      {/* ── Confirm modal (live mode only) ─────────────────────────────────── */}
      <ConfirmRunAllModal
        isOpen={pendingConfirm !== null}
        stepCount={pendingConfirm?.stepCount ?? 0}
        estimatedCost={pendingConfirm?.estimatedCost ?? 0}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={() => {
          setPendingConfirm(null);
          void executeRunAll();
        }}
      />
    </div>
  );
}
