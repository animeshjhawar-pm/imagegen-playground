"use client";

import { usePlayground } from "@/context/PlaygroundContext";
import { PIPELINES } from "@/config/pipelines";
import { ClientGroup } from "./ClientGroup";

export function PipelineTable() {
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

  // colSpan = Flow label col + N step cols + Final Output col
  const colSpan = 1 + pipeline.steps.length + 1;

  return (
    <div className="overflow-x-auto flex-1">
      <table className="border-collapse min-w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-700 bg-neutral-950 sticky top-0 z-10">
            {/* Flow label header */}
            <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-neutral-600 whitespace-nowrap min-w-[60px]">
              Flow
            </th>
            {/* Step headers */}
            {pipeline.steps.map((step, i) => (
              <th
                key={step.name}
                className="px-3 py-2 text-left border-l border-neutral-800 min-w-[360px] max-w-[360px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 font-mono">{i + 1}.</span>
                  <span className="text-neutral-300 font-semibold truncate">{step.title}</span>
                </div>
              </th>
            ))}
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
            clients.map((client) => (
              <ClientGroup
                key={client.id}
                client={client}
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
