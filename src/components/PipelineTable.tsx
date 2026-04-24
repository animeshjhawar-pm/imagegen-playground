"use client";

import { usePlayground } from "@/context/PlaygroundContext";
import { PIPELINES } from "@/config/pipelines";
import { ClientGroup } from "./ClientGroup";

interface PipelineTableProps {
  /** Fire a run-all for a single step across every client (both flows). */
  onRunStep: (stepName: string) => void;
  /** null | "all" | stepName — drives the per-step header button state. */
  runningScope: null | "all" | string;
}

export function PipelineTable({ onRunStep, runningScope }: PipelineTableProps) {
  const { state } = usePlayground();
  const { pageType, imageType, clients, lastAddedClientId } = state;

  if (!pageType || !imageType) return null;

  const pipeline = PIPELINES[`${pageType}:${imageType}`];
  if (!pipeline) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-[200px]">
        <p className="text-neutral-600 text-sm">
          No pipeline defined for {pageType}:{imageType}
        </p>
      </div>
    );
  }

  const isRunning = runningScope !== null;
  const canRun    = clients.length > 0 && !isRunning;

  // colSpan = Flow label col + N step cols + Final Output col
  const colSpan = 1 + pipeline.steps.length + 1;

  return (
    <div className="overflow-x-auto flex-1">
      {pipeline.alignmentNote && (
        <div className="px-6 py-2.5 bg-violet-950/20 border-b border-violet-900/40
          text-[11px] text-violet-200/80 leading-relaxed flex items-start gap-2">
          <span className="text-violet-400 mt-[1px]" title="Stormbreaker alignment note">ⓘ</span>
          <span>{pipeline.alignmentNote}</span>
        </div>
      )}
      <table className="border-collapse min-w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-700 bg-neutral-950 sticky top-0 z-10">
            {/* Flow label header */}
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-neutral-600 whitespace-nowrap min-w-[60px]">
              Flow
            </th>
            {/* Step headers */}
            {pipeline.steps.map((step, i) => {
              const isThisRunning = runningScope === step.name;
              return (
                <th
                  key={step.name}
                  className="px-3 py-2 text-left border-l border-neutral-800 min-w-[360px] max-w-[360px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-600 font-mono">{i + 1}.</span>
                    <span className="text-neutral-300 font-semibold truncate flex-1">{step.title}</span>
                    {/* Picker steps don't make a provider call, so there's
                     *  nothing to "run all" — the selection is set directly
                     *  in the cell via click. Hide the button rather than
                     *  disabling it so the header stays uncluttered. */}
                    {!step.picker && (
                      <button
                        onClick={() => onRunStep(step.name)}
                        disabled={!canRun}
                        title={
                          !canRun
                            ? (isRunning ? "Another run is in progress" : "Add at least one client first")
                            : `Run this step for all ${clients.length} client${clients.length === 1 ? "" : "s"}`
                        }
                        className="px-2 py-0.5 text-[10px] rounded font-medium
                          bg-violet-700/70 text-violet-50 hover:bg-violet-600
                          disabled:opacity-30 disabled:cursor-not-allowed
                          transition-colors whitespace-nowrap"
                      >
                        {isThisRunning ? "Running…" : "▶ Run all"}
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
            {/* Final output header */}
            <th className="px-3 py-2 text-left border-l border-neutral-800 min-w-[200px] max-w-[220px]">
              <span className="text-neutral-300 font-semibold">Final Output</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td
                colSpan={colSpan}
                className="text-center py-16 text-neutral-600 text-sm italic"
              >
                No clients yet — click &quot;+ Add Client&quot; to start.
              </td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <ClientGroup
                key={client.id}
                client={client}
                position={index + 1}
                pipeline={pipeline}
                pageType={pageType}
                imageType={imageType}
                colSpan={colSpan}
                isLastAdded={client.id === lastAddedClientId}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
