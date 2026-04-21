"use client";

import type { PipelineDefinition, PageType, ImageType } from "@/config/pipelines";
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
}

export function FlowRow({
  flowType, flowIndex = 0, labelAdornment,
  client, pipeline, pageType, imageType,
}: FlowRowProps) {
  const flow =
    flowType === "old"
      ? client.oldFlow
      : client.newFlows[flowIndex] ?? { stepStates: {} };

  const lastStep = pipeline.steps[pipeline.steps.length - 1];
  const lastStepState = flow.stepStates[lastStep?.name ?? ""] ?? { output: "", status: "idle" };

  const label =
    flowType === "old"
      ? "Old"
      : flowIndex === 0 ? "New" : `New ${flowIndex + 1}`;

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

      {/* Step cells */}
      {pipeline.steps.map((step) => (
        <StepCell
          key={step.name}
          step={step}
          flowType={flowType}
          flowIndex={flowIndex}
          clientId={client.id}
          client={client}
          pageType={pageType}
          imageType={imageType}
          defaultAspectRatio={pipeline.defaultAspectRatio}
        />
      ))}

      {/* Final output */}
      <FinalOutputCell output={lastStepState.output} status={lastStepState.status} />
    </tr>
  );
}
