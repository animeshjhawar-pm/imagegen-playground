import type { PageType, ImageType, StepDefinition } from "@/config/pipelines";

interface RunStepParams {
  pageType: PageType;
  imageType: ImageType;
  flowType: "old" | "new";
  step: StepDefinition;
  resolvedInputs: Record<string, string>;
  /** Pipeline-level aspect ratio, injected for generate_image step. */
  aspectRatio?: string;
  /** Phase 3: observability metadata forwarded to Portkey. */
  clientId: string;
  /** Phase 3: `${pageType}:${imageType}` — lets the route resolve the full StepDefinition server-side. */
  pipelineKey: string;
  /** Optional: overrides the step's system prompt literally (skips template). */
  systemPromptOverride?: string;
  /** Optional: overrides the interpolated user prompt literally (skips template). */
  userPromptOverride?: string;
  /** Per-step configuration (e.g. generate_image model + search toggles).
   *  Opaque to runStep; the server interprets it per step name. */
  stepConfig?: Record<string, unknown>;
  /** Aborts the client-side fetch when triggered. The server-side request
   *  to the upstream provider may still complete (we can't cancel that);
   *  the UI just stops listening. */
  signal?: AbortSignal;
}

interface RunStepResult {
  output: string;
  status: "completed" | "failed";
  error?: string;
  /** Non-fatal notice from the server (e.g. input truncation). */
  warning?: string;
}

export async function runStep(params: RunStepParams): Promise<RunStepResult> {
  const {
    pageType, imageType, flowType, step, resolvedInputs, aspectRatio,
    clientId, pipelineKey,
    systemPromptOverride, userPromptOverride, stepConfig,
    signal,
  } = params;

  const response = await fetch("/api/run-step", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageType,
      imageType,
      flowType,
      stepName: step.name,
      inputs: resolvedInputs,
      aspectRatio,
      clientId,
      pipelineKey,
      systemPromptOverride,
      userPromptOverride,
      stepConfig,
    }),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => `HTTP ${response.status}`);
    return { output: text, status: "failed", error: text };
  }

  const data = (await response.json()) as {
    output: string;
    status: "completed" | "failed";
    error?: string;
    warning?: string;
    completedAt: string;
  };

  if (data.status === "failed") {
    return { output: data.error ?? "Unknown error", status: "failed", error: data.error };
  }

  return { output: data.output, status: "completed", warning: data.warning };
}
