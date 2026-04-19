// ---------------------------------------------------------------------------
// Pipeline type definitions and per-image-type configuration.
//
// The nine (pageType × imageType) pipelines run through the same 5-step
// skeleton but swap in different Step 4 definitions so each combination
// follows stormbreaker's actual production flow (see docs/backend-context.md
// §2 and the per-type breakdowns below). Prompts live in prompts-old-flow.ts
// (frozen) and prompts-new-flow.ts (editable); this file only composes.
// ---------------------------------------------------------------------------

import {
  IMAGE_GENERATION_SYSTEM_PROMPT,
  BUILD_IMAGE_PROMPT_USER_TEMPLATE,
  COVER_IMAGE_PROMPT_TEMPLATE,
} from "./prompts-old-flow";
import {
  IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND,
  COVER_IMAGE_PROMPT_TEMPLATE_WITH_BRAND,
  EXTRACT_GRAPHIC_TOKEN_SYSTEM_PROMPT,
  EXTRACT_GRAPHIC_TOKEN_USER_TEMPLATE,
  GENERATE_PLACEHOLDER_DESCRIPTION_SYSTEM_PROMPT,
  GENERATE_PLACEHOLDER_DESCRIPTION_USER_TEMPLATE,
} from "./prompts-new-flow";

export type PageType = "blog" | "service" | "category";

export type ImageType =
  | "thumbnail"
  | "cover"
  | "internal"
  | "external"
  | "infographic"
  | "generic"
  | "title"
  | "h2"
  | "industry";

export type StepStatus = "idle" | "running" | "completed" | "failed";
export type StepDiff = "same_as_old" | "modified" | "new" | "skipped";
export type OutputType = "text" | "text_tagged" | "json" | "image_url" | "search_results";

export type StepInputSource =
  | { kind: "user_input" }
  | { kind: "step_output"; stepName: string; field?: string }
  | { kind: "config" }
  | { kind: "client_context"; field: string };

export interface StepInputDef {
  name: string;
  label: string;
  source: StepInputSource;
  required: boolean;
}

export interface OutputFieldDef {
  name: string;
  label: string;
  outputType: OutputType;
}

export interface StepDefinition {
  name: string;
  title: string;
  description: string;
  model: string;
  provider: "firecrawl" | "portkey" | "replicate" | "none";
  diffOld: StepDiff;
  diffNew: StepDiff;
  inputs: StepInputDef[];
  systemPromptOld?: string;
  systemPromptNew?: string;
  userPromptTemplate?: string;
  outputType: OutputType;
  /**
   * When present, the step's output is a JSON object and these named keys
   * are rendered as separate editable sub-outputs in the UI.
   */
  outputFields?: OutputFieldDef[];
  /**
   * When true, the step skips the LLM call and returns its interpolated
   * systemPromptOld/systemPromptNew directly as the output. Used for
   * stormbreaker flows that don't run an LLM prompt-expansion step
   * (blog covers/thumbnails = hardcoded prompt; blog internal = raw
   * description passed straight to Replicate).
   */
  renderOnly?: boolean;
}

export interface ClientContextField {
  name: string;
  label: string;
  kind: "text" | "textarea" | "json" | "url" | "select";
  required: boolean;
  options?: string[];
  default?: string;
}

export interface PipelineDefinition {
  steps: StepDefinition[];
  clientContextFields: ClientContextField[];
  /** Aspect ratio passed to Replicate for this combination. */
  defaultAspectRatio: string;
  /** Short note shown above the pipeline table — flags any gaps vs stormbreaker. */
  alignmentNote?: string;
}

// ---------------------------------------------------------------------------
// Image types per page type
// ---------------------------------------------------------------------------

export const IMAGE_TYPES_BY_PAGE: Record<PageType, ImageType[]> = {
  blog: ["thumbnail", "cover", "internal", "external", "infographic", "generic"],
  service: ["title", "h2"],
  category: ["industry"],
};

export const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  thumbnail: "Thumbnail",
  cover: "Cover",
  internal: "Internal (vector DB)",
  external: "External (SERP search)",
  infographic: "Infographic",
  generic: "Generic",
  title: "Title Image",
  h2: "H2 Image",
  industry: "Industry Image",
};

// ---------------------------------------------------------------------------
// Shared client context fields
// ---------------------------------------------------------------------------

const SHARED_CLIENT_CONTEXT_FIELDS: ClientContextField[] = [
  { name: "client_homepage_url", label: "Client Homepage URL", kind: "url", required: true },
  {
    name: "business_context_token",
    label: "Business Context / Blog Topic / Image Description",
    kind: "textarea",
    required: false,
  },
  { name: "company_logo_url", label: "Company Logo URL", kind: "url", required: false },
  { name: "graphic_token",    label: "Graphic Token Override (JSON)", kind: "json", required: false },
];

// ---------------------------------------------------------------------------
// Step factories — shared pieces (Steps 1, 2, 3, 5)
// ---------------------------------------------------------------------------

const scrapeStep: StepDefinition = {
  name: "scrape_client_site",
  title: "Scrape Client Site",
  description:
    "Crawls the client homepage with Firecrawl and extracts clean HTML + brand JSON. Playground-only helper for the new flow; stormbreaker reads this data from Postgres.",
  model: "firecrawl",
  provider: "firecrawl",
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "client_homepage_url",
      label: "Client Homepage URL",
      source: { kind: "client_context", field: "client_homepage_url" },
      required: true,
    },
  ],
  outputType: "json",
  outputFields: [
    { name: "clean_html",    label: "Cleaned HTML",  outputType: "text" },
    { name: "branding_json", label: "Branding JSON", outputType: "json" },
  ],
};

const extractGraphicTokenStep: StepDefinition = {
  name: "extract_graphic_token",
  title: "Extract Graphic Token",
  description:
    "Uses Claude to extract a structured graphic_token JSON from the crawled page HTML + branding data. New-flow only.",
  model: "claude-sonnet-4-5",
  provider: "portkey",
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "clean_html",
      label: "Clean HTML",
      source: { kind: "step_output", stepName: "scrape_client_site", field: "clean_html" },
      required: true,
    },
    {
      name: "branding_json",
      label: "Branding JSON",
      source: { kind: "step_output", stepName: "scrape_client_site", field: "branding_json" },
      required: true,
    },
  ],
  systemPromptNew:    EXTRACT_GRAPHIC_TOKEN_SYSTEM_PROMPT,
  userPromptTemplate: EXTRACT_GRAPHIC_TOKEN_USER_TEMPLATE,
  outputType: "json",
};

const generatePlaceholderDescriptionStep: StepDefinition = {
  name: "generate_placeholder_description",
  title: "Generate Placeholder Description",
  description:
    "New-flow-only helper: enriches a short image description with graphic_token brand context. Stormbreaker reads the description from Postgres page_info in production.",
  model: "claude-sonnet-4-5",
  provider: "portkey",
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "business_context_token",
      label: "Business Context / Description",
      source: { kind: "client_context", field: "business_context_token" },
      required: false,
    },
    {
      name: "graphic_token",
      label: "Graphic Token",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
    },
  ],
  systemPromptNew:    GENERATE_PLACEHOLDER_DESCRIPTION_SYSTEM_PROMPT,
  userPromptTemplate: GENERATE_PLACEHOLDER_DESCRIPTION_USER_TEMPLATE,
  outputType: "text",
};

const generateImageStep: StepDefinition = {
  name: "generate_image",
  title: "Generate Image",
  description:
    "Sends the final prompt to Replicate (google/nano-banana-pro). Logo (if provided) is passed as image_input for img2img.",
  model: "google/nano-banana-pro",
  provider: "replicate",
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "final_prompt",
      label: "Final Prompt",
      source: { kind: "step_output", stepName: "build_image_prompt" },
      required: true,
    },
    {
      name: "image_input",
      label: "Image Input URL (img2img, optional)",
      source: { kind: "client_context", field: "company_logo_url" },
      required: false,
    },
  ],
  outputType: "image_url",
};

// ---------------------------------------------------------------------------
// Step 4 variants — the only step that meaningfully differs per image type
// ---------------------------------------------------------------------------

/** Default Step 4: LLM expansion via Claude 4.6. Used by infographic,
 *  generic, service:title, service:h2, category:industry, and (as an
 *  approximation) blog:external. */
const buildImagePromptStep_LLM: StepDefinition = {
  name: "build_image_prompt",
  title: "Build Image Prompt",
  description:
    "Mirrors stormbreaker's generate_prompt(amp_up=False) step — expands a short image description into a photorealistic prompt via Claude. Old flow: verbatim image_generation_system_prompt. New flow: same + BRAND IDENTITY block.",
  model: "claude-sonnet-4-6",
  provider: "portkey",
  diffOld: "same_as_old",
  diffNew: "modified",
  inputs: [
    {
      name: "placeholder_description",
      label: "Image Description",
      source: { kind: "step_output", stepName: "generate_placeholder_description" },
      required: true,
    },
    {
      name: "graphic_token",
      label: "Graphic Token (new flow only)",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
    },
  ],
  systemPromptOld:    IMAGE_GENERATION_SYSTEM_PROMPT,
  systemPromptNew:    IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND,
  userPromptTemplate: BUILD_IMAGE_PROMPT_USER_TEMPLATE,
  outputType: "text_tagged",
};

/** Step 4 for blog:cover and blog:thumbnail — no LLM call. Matches
 *  stormbreaker's handlers/create_blog_pages/image_operations/cover_image.py,
 *  which passes the hardcoded template directly to Replicate. */
const renderCoverPromptStep: StepDefinition = {
  name: "build_image_prompt",
  title: "Render Cover Prompt",
  description:
    "Stormbreaker's cover flow is deterministic — the hardcoded prompt from cover_image.py:create_cover_image_prompt() is sent straight to Replicate. No LLM enhancement. Old flow uses the template verbatim; new flow appends the BRAND IDENTITY block from the graphic_token.",
  model: "(template — no LLM)",
  provider: "none",
  renderOnly: true,
  diffOld: "same_as_old",
  diffNew: "modified",
  inputs: [
    {
      name: "blog_topic",
      label: "Blog Topic",
      source: { kind: "client_context", field: "business_context_token" },
      required: true,
    },
    {
      name: "graphic_token",
      label: "Graphic Token (new flow only)",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
    },
  ],
  // For renderOnly steps, systemPromptOld/New hold the output template.
  systemPromptOld: COVER_IMAGE_PROMPT_TEMPLATE,
  systemPromptNew: COVER_IMAGE_PROMPT_TEMPLATE_WITH_BRAND,
  outputType: "text",
};

/** Step 4 for blog:internal — no LLM call. Matches stormbreaker's
 *  internal_images.py which passes the raw description to Replicate after
 *  selecting the best Pinecone match via GPT-4o. (Pinecone selection is
 *  not implemented in the playground; paste the chosen description into
 *  the business-context field.) */
const rawDescriptionStep: StepDefinition = {
  name: "build_image_prompt",
  title: "Pass-Through Description",
  description:
    "Stormbreaker's internal-image flow does NOT run an LLM prompt-expansion step — the raw description from the image_requirement tag is sent straight to Replicate. Playground approximation: type the description into the Business Context field on the client.",
  model: "(no model — pass-through)",
  provider: "none",
  renderOnly: true,
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "image_description",
      label: "Image Description",
      source: { kind: "client_context", field: "business_context_token" },
      required: true,
    },
  ],
  systemPromptOld: "{{image_description}}",
  systemPromptNew: "{{image_description}}",
  outputType: "text",
};

// ---------------------------------------------------------------------------
// Pipeline composer
// ---------------------------------------------------------------------------

function makePipeline(opts: {
  step4: StepDefinition;
  defaultAspectRatio: string;
  alignmentNote?: string;
}): PipelineDefinition {
  return {
    steps: [
      scrapeStep,
      extractGraphicTokenStep,
      generatePlaceholderDescriptionStep,
      opts.step4,
      generateImageStep,
    ],
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: opts.defaultAspectRatio,
    alignmentNote: opts.alignmentNote,
  };
}

// ---------------------------------------------------------------------------
// PIPELINES — keyed as `${pageType}:${imageType}`
// ---------------------------------------------------------------------------

export const PIPELINES: Record<string, PipelineDefinition> = {
  // Blog cover/thumbnail — hardcoded prompt flow (see cover_image.py).
  "blog:cover": makePipeline({
    step4: renderCoverPromptStep,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Type the blog topic into Business Context. Old flow = stormbreaker's hardcoded cover prompt (no LLM). New flow appends a BRAND IDENTITY block, matching scripts/test_infographic_graphic_token.py.",
  }),
  "blog:thumbnail": makePipeline({
    step4: renderCoverPromptStep,
    defaultAspectRatio: "1:1",
    alignmentNote:
      "Same hardcoded-prompt flow as blog:cover but with a 1:1 aspect ratio (stormbreaker generates both in parallel from the same prompt).",
  }),

  // Blog internal — raw description, Pinecone-selected img2img in production.
  "blog:internal": makePipeline({
    step4: rawDescriptionStep,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Stormbreaker: Pinecone search → GPT-4o select best match → Replicate img2img with the raw description. Vector search isn't implemented in the playground — paste the description and (optionally) the matched image URL into Logo URL as image_input.",
  }),

  // Blog external — complex SERP flow; playground runs the LLM approximation.
  "blog:external": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Stormbreaker's external flow runs Serper image search + GPT-4o Vision + Claude Sonnet 4.5 selection + an EXTERNAL_IMAGE_UPDATION Portkey prompt before the final Replicate call. The playground uses the standard Claude 4.6 prompt-expansion step as an approximation — treat outputs accordingly.",
  }),

  // Blog infographic/generic — straight Claude 4.6 expansion + Replicate.
  "blog:infographic": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "1:1",
    alignmentNote:
      "Matches stormbreaker's generic_images.py flow: Claude 4.6 expands the description, Replicate generates with company logo as image_input.",
  }),
  "blog:generic": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Same handler as Infographic in stormbreaker (generic_images.py); differs only by the type attribute on the image_requirement tag.",
  }),

  // Service / Category — Pinecone path in production, LLM fallback here.
  "service:title": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Stormbreaker: Pinecone search → if match, refine via amp-up prompt; if miss, Claude 4.6 expansion + Replicate (the path the playground implements).",
  }),
  "service:h2": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Same handler as service:title (update_images.py); the distinction only exists in the context field of the image object in page_info.",
  }),

  "category:industry": makePipeline({
    step4: buildImagePromptStep_LLM,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Stormbreaker: Pinecone search → if match, upscale only (no re-generation); if miss, Claude 4.6 expansion + Replicate (the path the playground implements).",
  }),
};
