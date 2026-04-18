"use client";

import type { PipelineDefinition, PageType, ImageType } from "@/config/pipelines";
import type { ClientState } from "@/state/playgroundReducer";
import { StepCell } from "./StepCell";
import { FinalOutputCell } from "./FinalOutputCell";

interface FlowRowProps {
  flowType: "old" | "new";
  client: ClientState;
  pipeline: PipelineDefinition;
  pageType: PageType;
  imageType: ImageType;
}

export function FlowRow({ flowType, client, pipeline, pageType, imageType }: FlowRowProps) {
  const flow = flowType === "old" ? client.oldFlow : client.newFlow;

  const lastStep = pipeline.steps[pipeline.steps.length - 1];
  const lastStepState = flow.stepStates[lastStep?.name ?? ""] ?? { output: "", status: "idle" };

  return (
    <tr className="border-b border-neutral-800/60 last:border-0">
      {/* Flow label */}
      <td className="align-top px-3 py-2 whitespace-nowrap min-w-[60px] max-w-[60px]">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
            flowType === "old"
              ? "bg-neutral-800 text-neutral-400"
              : "bg-indigo-900/50 text-indigo-300"
          }`}
        >
          {flowType === "old" ? "Old" : "New"}
        </span>
      </td>

      {/* Step cells */}
      {pipeline.steps.map((step) => (
        <StepCell
          key={step.name}
          step={step}
          flowType={flowType}
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
