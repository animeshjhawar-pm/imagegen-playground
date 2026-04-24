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
}

export function FlowRow({
  flowType, flowIndex = 0, labelAdornment,
  client, pipeline, pageType, imageType,
  isFirstFlowRow, totalFlowRows,
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

  return (
    <tr className="border-b border-neutral-800/60 last:border-0">
      {/* Flow label */}
      <td className="align-top px-3 py-2 whitespace-nowrap min-w-[60px] max-w-[60px]">
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
