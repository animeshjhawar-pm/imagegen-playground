// ---------------------------------------------------------------------------
// POST /api/run-step
//
// Branches on `x-dry-run` header:
//   - true  → returns the Phase 2 mock outputs (free, safe, no API calls).
//   - false → fires real calls to Firecrawl / Portkey / Replicate.
//
// Request body:
//   { pageType, imageType, flowType, stepName, inputs, aspectRatio?, clientId, pipelineKey }
//
// Response (always 200, even on step failure — failure is reported in body):
//   { output: string, status: "completed" | "failed", error?, completedAt }
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { PIPELINES, type StepDefinition } from "@/config/pipelines";
import { scrapeClientSite } from "@/lib/providers/firecrawl";
import { callPortkey, callPortkeyStoredPrompt } from "@/lib/providers/portkey";
import { generateImage } from "@/lib/providers/replicate";
import { prepareLLMVars } from "@/lib/prepareLLMVars";

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
}

interface RunStepResponse {
  output: string;
  status: "completed" | "failed";
  error?: string;
  completedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

function ok(output: string): NextResponse<RunStepResponse> {
  return NextResponse.json({ output, status: "completed", completedAt: now() });
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

  const { pageType, imageType, stepName, flowType, inputs } = body;
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

  const isDryRun = request.headers.get("x-dry-run") === "true";

  if (isDryRun) {
    await randomDelay();
    const failure = maybeFailure();
    if (failure) {
      return NextResponse.json({ ...failure, completedAt: now() });
    }
    return NextResponse.json({
      output: buildMockOutput(stepName, flowType, inputs),
      status: "completed",
      completedAt: now(),
    });
  }

  // --- Live mode --------------------------------------------------------------
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
    systemPromptOverride, userPromptOverride,
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
      // Derived vars (e.g. brand_lines from graphic_token JSON) are available
      // to both system + user prompt templates.
      const vars = prepareLLMVars(inputs);

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

      const userPrompt =
        userPromptOverride ??
        (stepDef.userPromptTemplate
          ? interpolate(stepDef.userPromptTemplate, vars)
          : Object.entries(inputs)
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
      return ok(result.text);
    }

    case "generate_image": {
      const finalPrompt = inputs["final_prompt"]?.trim();
      if (!finalPrompt) return fail("Missing final_prompt");

      // Strip <final_prompt>…</final_prompt> wrapper from Step 4 output if present.
      const promptMatch = finalPrompt.match(/<final_prompt>([\s\S]*?)<\/final_prompt>/);
      const cleanPrompt = promptMatch ? promptMatch[1].trim() : finalPrompt;

      const imageInputRaw = inputs["image_input"]?.trim();
      const imageInput =
        imageInputRaw && imageInputRaw.length > 0 ? [imageInputRaw] : undefined;

      const result = await generateImage({
        prompt: cleanPrompt,
        aspectRatio: aspectRatio ?? "1:1",
        imageInput,
      });
      return ok(result.image_url);
    }

    default:
      return fail(`Unsupported step: ${stepName}`);
  }
}

// ---------------------------------------------------------------------------
// Dry-run mock
// ---------------------------------------------------------------------------

function randomDelay(): Promise<void> {
  const ms = 800 + Math.random() * 700;
  return new Promise((r) => setTimeout(r, ms));
}

function maybeFailure(): { output: string; status: "failed"; error: string } | null {
  if (Math.random() < 0.05) {
    const errors = [
      "Replicate prediction failed: model returned 500",
      "Portkey timeout after 30s — upstream Claude API unreachable",
      "Firecrawl rate limit exceeded (429): retry after 60s",
      "Pinecone index not found for namespace: test_namespace",
    ];
    const msg = errors[Math.floor(Math.random() * errors.length)];
    return { output: msg, status: "failed", error: msg };
  }
  return null;
}

function buildMockOutput(
  stepName: string,
  flowType: "old" | "new",
  inputs: Record<string, string>
): string {
  const flowTag = flowType === "new" ? " [new-flow]" : " [old-flow]";

  switch (stepName) {
    case "scrape_client_site": {
      const url = inputs["client_homepage_url"] || "https://example.com";
      return JSON.stringify({
        clean_html: `<html><head><title>Example Corp</title></head><body><h1>Welcome to Example Corp</h1><p>We provide professional B2B services.</p></body></html>`,
        branding_json: {
          primary_color: "#0066CC",
          secondary_color: "#003D7A",
          font: "Inter",
          logo_url: `${url}/logo.png`,
          brand_name: "Example Corp",
        },
      });
    }

    case "extract_graphic_token": {
      return JSON.stringify({
        primary_color: "#0066CC",
        secondary_color: "#003D7A",
        accent_color: "#FF6B35",
        text_color: "#1A1A2E",
        heading_font: "Inter",
        body_font: "Inter",
        brand_style:
          "Clean, modern, and professional with a focus on trust and expertise.",
        tagline: "Empowering businesses to grow.",
        logo_style: "Minimal wordmark with geometric icon",
        industry: "B2B Professional Services",
      });
    }

    case "generate_placeholder_description": {
      const contextHint = inputs["business_context_token"]
        ? ` Context: ${inputs["business_context_token"].slice(0, 60)}.`
        : "";
      const base = `A team of confident professionals collaborating in a bright, modern office space, showcasing productivity and teamwork.${contextHint}`;
      if (flowType === "new") {
        return (
          base +
          " The scene reflects a clean, modern aesthetic with deep navy blue (#0066CC) accent elements and Inter typography, evoking trust and expertise in the B2B professional services industry."
        );
      }
      return base;
    }

    case "build_image_prompt": {
      const description =
        inputs["placeholder_description"] ||
        "professionals collaborating in a modern office";
      const brandBlock =
        flowType === "new"
          ? " Use brand colors: primary #0066CC (navy blue), accent #FF6B35 (orange). Style: clean and minimal. Industry: B2B Professional Services."
          : "";
      return `<final_prompt>Photorealistic professional commercial photography, 4K resolution, sharp focus. ${description}. Bright welcoming natural light streams through floor-to-ceiling windows, casting soft shadows. People are looking directly at the camera with warm, confident expressions. Bokeh background blurs an open-plan tech office. Vibrant, rich, inviting colors with eye-level medium shot composition.${brandBlock} Shot on Phase One IQ4 150MP, 85mm f/1.4 lens.${flowTag}</final_prompt>`;
    }

    case "generate_image": {
      const seed = Math.floor(Math.random() * 9000) + 1000;
      return `https://picsum.photos/seed/${seed}/800/600`;
    }

    default:
      return `Mock output for step "${stepName}"${flowTag}`;
  }
}
