"use client";

import type { PipelineDefinition, PageType, ImageType } from "@/config/pipelines";
import { getDisabledStepsForFlow } from "@/config/pipelines";
import type { ClientState } from "@/state/playgroundReducer";
import { StepCell } from "./StepCell";
import { FinalOutputCell } from "./FinalOutputCell";

interface FlowRowProps {
  flowType: "old" | "new";
  /** For flowType "new": 0 = original "New", 1 = "New 2", etc. */
  flowIndex?: number;
  /** Extra content rendered after the flow label (e.g. "+ Add lane" button). */
  labelAdornment?: React.ReactNode;
  client: ClientState;
  pipeline: PipelineDefinition;
  pageType: PageType;
  imageType: ImageType;
  /** True for the topmost flow row of a client (old flow).
   *  Only the topmost row renders shared cells (picker steps); subsequent
   *  rows omit those columns so the rowspan'd cell covers them. */
  isFirstFlowRow: boolean;
  /** Total number of flow rows rendered for this client (1 old + N new).
   *  Used as the rowSpan for shared cells. */
  totalFlowRows: number;
  /** Run every step for this single (client, flow, lane) left-to-right. */
  onRunRow: (clientId: string, flowType: "old" | "new", flowIndex: number) => void;
  /** Global running scope; used to disable the Run-row button when any
   *  other run is in flight, and to highlight the button when THIS row
   *  is the one running. */
  runningScope: null | "all" | string;
}

export function FlowRow({
  flowType, flowIndex = 0, labelAdornment,
  client, pipeline, pageType, imageType,
  isFirstFlowRow, totalFlowRows,
  onRunRow, runningScope,
}: FlowRowProps) {
  const flow =
    flowType === "old"
      ? client.oldFlow
      : client.newFlows[flowIndex] ?? { stepStates: {} };

  const lastStep = pipeline.steps[pipeline.steps.length - 1];
  const lastStepState = flow.stepStates[lastStep?.name ?? ""] ?? { output: "", status: "idle" };

  // Steps that shouldn't run for this (pipeline, flow) because the
  // required topic is missing from the client context. See
  // getDisabledStepsForFlow for the gating rules.
  const pipelineKey = `${pageType}:${imageType}`;
  const disabledSteps = getDisabledStepsForFlow(pipelineKey, client.context, flowType);

  const label =
    flowType === "old"
      ? "Old"
      : flowIndex === 0 ? "New" : `New ${flowIndex + 1}`;

  // Per-flow aspect-ratio override (blog:thumbnail uses this: old=1:1, new=3:2).
  // Falls back to the shared default when not set.
  const effectiveAspectRatio =
    (flowType === "old"
      ? pipeline.defaultAspectRatioOld
      : pipeline.defaultAspectRatioNew) ?? pipeline.defaultAspectRatio;

  // Disable Run-row while any other run is in flight; highlight when
  // THIS row is the one currently running.
  const thisRowScope = `row:${client.id}:${flowType}:${flowIndex}`;
  const isThisRowRunning = runningScope === thisRowScope;
  const isAnyRunning = runningScope !== null;
  const canRunRow = !isAnyRunning || isThisRowRunning;

  return (
    <tr className="border-b border-neutral-800/60 last:border-0">
      {/* Flow label */}
      <td className="align-top px-3 py-2 whitespace-nowrap min-w-[88px] max-w-[88px]">
        <div className="flex flex-col gap-1 items-start">
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
              flowType === "old"
                ? "bg-neutral-800 text-neutral-400"
                : "bg-indigo-900/50 text-indigo-300"
            }`}
          >
            {label}
          </span>
          {labelAdornment}
          {/* Per-row Run All — runs every step for this single lane
           *  left-to-right, fail-stops if any step fails. */}
          <button
            onClick={() => onRunRow(client.id, flowType, flowIndex)}
            disabled={!canRunRow}
            title={
              isThisRowRunning
                ? "This row is running…"
                : isAnyRunning
                  ? "Another run is in progress"
                  : `Run every step for this ${label} row, left to right`
            }
            className={`mt-0.5 px-1.5 py-0.5 text-[9px] rounded font-medium whitespace-nowrap
              transition-colors inline-flex items-center gap-1
              ${isThisRowRunning
                ? "bg-violet-600 text-white animate-pulse"
                : "bg-neutral-800 text-neutral-300 hover:bg-violet-700/60 hover:text-violet-50"
              }
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-neutral-800
              disabled:hover:text-neutral-300`}
          >
            {isThisRowRunning ? "Running…" : "▶ Run row"}
          </button>
        </div>
      </td>

      {/* Step cells — picker steps are shared across all flow rows for a
       *  client, rendered only on the topmost row with rowSpan covering
       *  the others. Subsequent flow rows omit the cell entirely. */}
      {pipeline.steps.map((step) => {
        if (step.picker) {
          if (!isFirstFlowRow) return null;
          return (
            <StepCell
              key={step.name}
              step={step}
              flowType={flowType}
              flowIndex={flowIndex}
              clientId={client.id}
              client={client}
              pageType={pageType}
              imageType={imageType}
              defaultAspectRatio={effectiveAspectRatio}
              disabled={disabledSteps.has(step.name)}
              rowSpan={totalFlowRows}
              sharedAcrossFlows
            />
          );
        }
        return (
          <StepCell
            key={step.name}
            step={step}
            flowType={flowType}
            flowIndex={flowIndex}
            clientId={client.id}
            client={client}
            pageType={pageType}
            imageType={imageType}
            defaultAspectRatio={effectiveAspectRatio}
            disabled={disabledSteps.has(step.name)}
          />
        );
      })}

      {/* Final output */}
      <FinalOutputCell output={lastStepState.output} status={lastStepState.status} />
    </tr>
  );
}
