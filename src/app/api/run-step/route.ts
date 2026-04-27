// ---------------------------------------------------------------------------
// POST /api/run-step
//
// Always fires real provider calls (Firecrawl / Portkey / Replicate).
// Dry-run / mock-response mode was removed on 2026-04-24 — mocks were
// hiding silent-empty gateway responses behind fake success.
//
// Request body:
//   { pageType, imageType, flowType, stepName, inputs, aspectRatio?, clientId, pipelineKey }
//
// Response (always 200, even on step failure — failure is reported in body):
//   { output: string, status: "completed" | "failed", error?, completedAt }
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { PIPELINES, resolveFixedAspectRatio, type StepDefinition } from "@/config/pipelines";
import { scrapeClientSite } from "@/lib/providers/firecrawl";
import { callPortkey, callPortkeyStoredPrompt } from "@/lib/providers/portkey";
import { generateImage } from "@/lib/providers/replicate";
import { prepareLLMVars } from "@/lib/prepareLLMVars";
import { truncateToTokenBudget } from "@/lib/tokenBudget";

/** Max tokens to send the Step-2 (extract_graphic_token) LLM as page markdown.
 *  Claude Sonnet's context window is ~200K — we leave headroom for system
 *  prompt + branding JSON + response. 150K is generous for well-structured
 *  marketing pages; truncation triggers only for pathological cases. */
const GRAPHIC_TOKEN_MARKDOWN_MAX_TOKENS = 150_000;

interface RunStepRequest {
  pageType: string;
  imageType: string;
  flowType: "old" | "new";
  stepName: string;
  inputs: Record<string, string>;
  aspectRatio?: string;
  clientId?: string;
  pipelineKey?: string;
  /** If present, sent literally as the LLM system prompt (bypasses step definition). */
  systemPromptOverride?: string;
  /** If present, sent literally as the LLM user prompt (bypasses userPromptTemplate). */
  userPromptOverride?: string;
  /** Step-specific config (e.g. generate_image model + toggles). */
  stepConfig?: Record<string, unknown>;
}

interface RunStepResponse {
  output: string;
  status: "completed" | "failed";
  error?: string;
  /** Non-fatal notice (e.g. "markdown truncated to fit 150K-token limit"). */
  warning?: string;
  completedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

function ok(output: string, warning?: string): NextResponse<RunStepResponse> {
  return NextResponse.json({
    output,
    status: "completed",
    ...(warning ? { warning } : {}),
    completedAt: now(),
  });
}

function fail(error: string): NextResponse<RunStepResponse> {
  return NextResponse.json({ output: "", status: "failed", error, completedAt: now() });
}

/** Replace {{var}} tokens; empty string for missing keys. */
function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? "");
}

function getStepDef(pipelineKey: string, stepName: string): StepDefinition | null {
  const pipeline = PIPELINES[pipelineKey];
  if (!pipeline) return null;
  return pipeline.steps.find((s) => s.name === stepName) ?? null;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse<RunStepResponse>> {
  let body: RunStepRequest;
  try {
    body = (await request.json()) as RunStepRequest;
  } catch {
    return NextResponse.json(
      { output: "", status: "failed", error: "Invalid JSON body", completedAt: now() },
      { status: 400 }
    );
  }

  const { pageType, imageType, stepName, flowType } = body;
  if (!pageType || !imageType || !stepName || !flowType) {
    return NextResponse.json(
      {
        output: "",
        status: "failed",
        error: "Missing required fields: pageType, imageType, stepName, flowType",
        completedAt: now(),
      },
      { status: 400 }
    );
  }

  // Dry-run / test-run mode was removed on 2026-04-24. Every request
  // now goes straight to the live provider — mocks were hiding silent
  // empty responses from the Portkey gateway, which made extract_graphic_token
  // look successful even when the LLM returned nothing.
  try {
    return await runLiveStep(body);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return fail(msg);
  }
}

// ---------------------------------------------------------------------------
// Live step dispatcher
// ---------------------------------------------------------------------------

async function runLiveStep(
  body: RunStepRequest
): Promise<NextResponse<RunStepResponse>> {
  const {
    stepName, flowType, inputs, aspectRatio, clientId, pipelineKey,
    systemPromptOverride, userPromptOverride, stepConfig,
  } = body;

  const key = pipelineKey ?? `${body.pageType}:${body.imageType}`;
  const stepDef = getStepDef(key, stepName);
  if (!stepDef) return fail(`Unknown pipeline/step: ${key}/${stepName}`);

  // Generic stored-prompt dispatch. When the step def carries a
  // promptIdOld / promptIdNew, we call Portkey's stored-prompt endpoint
  // (prompt body managed in dashboard) instead of the chat-completions
  // path. Overrides fall through to the regular chat path below.
  const storedPromptId = flowType === "new" ? stepDef.promptIdNew : stepDef.promptIdOld;
  if (storedPromptId && !systemPromptOverride && !userPromptOverride) {
    const varNames = stepDef.promptVariables ?? stepDef.inputs.map((i) => i.name);
    const variables: Record<string, unknown> = {};
    for (const name of varNames) {
      variables[name] = inputs[name] ?? "";
    }
    const result = await callPortkeyStoredPrompt({
      promptId: storedPromptId,
      variables,
      metadata: {
        step_name: stepName,
        flow_type: flowType,
        client_id: clientId ?? "unknown",
      },
    });
    return ok(result.text);
  }

  // Universal renderOnly handler — runs BEFORE the step-name switch so
  // any step flagged renderOnly (regardless of name) interpolates its
  // per-flow systemPrompt template and returns. This lets a single
  // generate_image step display a pre-rendered URL on the old flow
  // (renderOnly with systemPromptOld set) while the new flow falls
  // through to the regular Replicate path (systemPromptNew left blank,
  // route falls through below).
  if (stepDef.renderOnly) {
    const systemTemplate =
      (flowType === "new" ? stepDef.systemPromptNew : stepDef.systemPromptOld) ?? "";
    if (systemTemplate || systemPromptOverride) {
      const vars = prepareLLMVars(inputs);
      const rendered = systemPromptOverride ?? interpolate(systemTemplate, vars);
      if (rendered) return ok(rendered);
    }
    // Fall through when this flow has no renderOnly template — the
    // switch below still gets a chance (e.g. amp_up new-flow Replicate).
  }

  switch (stepName) {
    case "scrape_client_site": {
      const url = inputs["client_homepage_url"]?.trim();
      if (!url) return fail("Missing client_homepage_url");
      const result = await scrapeClientSite(url);
      return ok(JSON.stringify(result));
    }

    case "extract_graphic_token":
    case "generate_image_description":
    case "generate_placeholder_description":
    case "build_image_prompt": {
      // Cap Step 2's `markdown` input so a pathologically large scrape
      // (WordPress pages can hit multi-MB) doesn't blow the LLM context.
      // Other steps aren't at risk — they take short derived strings.
      let truncationWarning: string | null = null;
      const effectiveInputs = { ...inputs };
      if (stepName === "extract_graphic_token" && effectiveInputs["markdown"]) {
        const { text, warning } = truncateToTokenBudget(
          effectiveInputs["markdown"],
          GRAPHIC_TOKEN_MARKDOWN_MAX_TOKENS,
          "Page markdown"
        );
        effectiveInputs["markdown"] = text;
        truncationWarning = warning;
      }

      // Note: aspect ratio is intentionally NOT injected at the
      // build_image_prompt step. One prompt is generated here, and the
      // same prompt is dispatched to the downstream image-gen step(s)
      // (e.g. cover_thumbnail pipelines fan out to 16:9 cover + 3:2/1:1
      // thumbnail renders). Aspect handling lives entirely at the
      // image-gen step via stepDef.fixedAspectRatio[Old|New].

      // Derived vars (e.g. brand_lines from graphic_token JSON) are available
      // to both system + user prompt templates.
      const vars = prepareLLMVars(effectiveInputs);

      const systemTemplate =
        (flowType === "new" ? stepDef.systemPromptNew : stepDef.systemPromptOld) ?? "";

      // renderOnly steps skip the LLM entirely — they interpolate the
      // template and return it as the output. Used by blog:cover/thumbnail
      // (hardcoded cover prompt) and blog:internal (raw description).
      if (stepDef.renderOnly) {
        const rendered = systemPromptOverride ?? interpolate(systemTemplate, vars);
        if (!rendered) {
          return fail(`No render template defined for ${stepName} (${flowType} flow)`);
        }
        return ok(rendered);
      }

      const systemPrompt =
        systemPromptOverride ??
        (systemTemplate ? interpolate(systemTemplate, vars) : "");
      if (!systemPrompt) {
        return fail(`No system prompt defined for ${stepName} (${flowType} flow)`);
      }

      // Flow-specific user template falls back to the shared one.
      const userTemplateForFlow =
        (flowType === "new" ? stepDef.userPromptTemplateNew : stepDef.userPromptTemplateOld) ??
        stepDef.userPromptTemplate;
      const userPrompt =
        userPromptOverride ??
        (userTemplateForFlow
          ? interpolate(userTemplateForFlow, vars)
          : Object.entries(effectiveInputs)
              .map(([k, v]) => `${k}:\n${v}`)
              .join("\n\n"));

      const metadata = {
        step_name: stepName,
        flow_type: flowType,
        client_id: clientId ?? "unknown",
      };

      const result = await callPortkey({
        model: stepDef.model,
        systemPrompt,
        userPrompt,
        // Match stormbreaker's services/replicate/replicate.py:generate_prompt()
        // (max_tokens=64000). Claude stops at natural end-of-turn, so this is
        // just a ceiling — no cost impact, keeps parity with production.
        maxTokens: 64000,
        metadata,
      });
      return ok(result.text, truncationWarning ?? undefined);
    }

    case "generate_image":
    case "generate_cover_image":
    case "generate_thumbnail_image": {
      const finalPrompt = inputs["final_prompt"]?.trim();
      if (!finalPrompt) {
        // Almost always means Step 4 (Generate Image Prompt / Cover /
        // Thumbnail / Infographic) hasn't produced output yet in this
        // flow — either it hasn't been run, or it failed. Point the
        // user at the real culprit instead of the opaque terse error.
        return fail(
          "Missing final_prompt — Step 4 (Generate Image Prompt) hasn't produced output for this flow. " +
          "Check that step's cell: if it's idle, click Run Step on it; if it has a red Step Failed banner, " +
          "read the error there and re-run it. Generate Image chains off of Step 4's output via step_output.build_image_prompt.",
        );
      }

      // Strip <final_prompt>…</final_prompt> wrapper from Step 4 output if present.
      const promptMatch = finalPrompt.match(/<final_prompt>([\s\S]*?)<\/final_prompt>/);
      const cleanPrompt = promptMatch ? promptMatch[1].trim() : finalPrompt;

      // image_input is the array Replicate uses for img2img references.
      // The first slot is the user's logo (`image_input` cell); any
      // additional inputs declared with `imageInputMember: true` are
      // appended in declaration order (custom:cover uses this to add
      // a fixed layout-scaffold URL alongside the logo). Empty values
      // are skipped.
      const imageInputArr: string[] = [];
      for (const inputDef of stepDef.inputs) {
        const isMember = inputDef.name === "image_input" || inputDef.imageInputMember;
        if (!isMember) continue;
        const v = inputs[inputDef.name]?.trim();
        if (v) imageInputArr.push(v);
      }
      const imageInput = imageInputArr.length > 0 ? imageInputArr : undefined;

      // Model + model-specific toggles come from stepConfig (new-flow UI).
      // Old flow always uses the default model — no UI to override it there.
      const rawModel = typeof stepConfig?.model === "string" ? stepConfig.model : undefined;
      const allowedModels = [
        "google/nano-banana-pro",
        "google/nano-banana-2",
        "bytedance/seedream-4",
        "openai/gpt-image-2",
        "black-forest-labs/flux-2-flex",
      ] as const;
      type ImgModel = typeof allowedModels[number];
      const model: ImgModel | undefined =
        rawModel && (allowedModels as readonly string[]).includes(rawModel)
          ? (rawModel as ImgModel)
          : undefined;

      // Step def's fixed aspect (e.g. cover=16:9, thumbnail=1:1 old /
      // 3:2 new) wins over both any incoming per-run aspect and the
      // pipeline default. Resolved per-flow so the merged pipeline can
      // produce different thumbnail sizes across old and new.
      const fixedAspect = resolveFixedAspectRatio(stepDef, flowType);
      const effectiveAspect = fixedAspect ?? aspectRatio ?? "1:1";
      const result = await generateImage({
        prompt: cleanPrompt,
        aspectRatio: effectiveAspect,
        imageInput,
        model,
        imageSearch:  typeof stepConfig?.imageSearch  === "boolean" ? stepConfig.imageSearch  : undefined,
        googleSearch: typeof stepConfig?.googleSearch === "boolean" ? stepConfig.googleSearch : undefined,
      });
      return ok(result.image_url);
    }

    default:
      return fail(`Unsupported step: ${stepName}`);
  }
}

// Dry-run / mock-response code lived here. Removed 2026-04-24 alongside
// the UI toggle — mocks were hiding real provider failures (notably the
// silent-empty Portkey extract_graphic_token case that surfaced April
// 23). Every run now hits the live provider.
