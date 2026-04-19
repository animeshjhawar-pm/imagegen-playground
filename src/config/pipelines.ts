// ---------------------------------------------------------------------------
// Pipeline type definitions and configuration.
// Reference: docs/backend-context.md
// All prompt strings live in ./prompts.ts — this file only references them.
// ---------------------------------------------------------------------------

import {
  IMAGE_GENERATION_SYSTEM_PROMPT,
  BUILD_IMAGE_PROMPT_USER_TEMPLATE,
} from "./prompts-old-flow";
import {
  IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND,
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
  /** Top-level key in the step's JSON output. */
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
  /** Fix 3: aspect ratio used for generate_image, not editable per-client. */
  defaultAspectRatio: string;
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
// Shared client context fields (Fix 2: removed aspect_ratio, renamed company_info)
// ---------------------------------------------------------------------------

const SHARED_CLIENT_CONTEXT_FIELDS: ClientContextField[] = [
  { name: "client_homepage_url", label: "Client Homepage URL", kind: "url", required: true },
  {
    name: "business_context_token",
    label: "Business Context Token",
    kind: "textarea",
    required: false,
  },
  {
    name: "company_logo_url",
    label: "Company Logo URL",
    kind: "url",
    required: false,
  },
  {
    name: "graphic_token",
    label: "Graphic Token Override (JSON)",
    kind: "json",
    required: false,
  },
];

// ---------------------------------------------------------------------------
// Shared 5-step template factory
// ---------------------------------------------------------------------------

function makeSteps(_combinationKey: string): StepDefinition[] {
  return [
    {
      name: "scrape_client_site",
      title: "Scrape Client Site",
      description:
        "Crawls the client homepage with Firecrawl and extracts clean HTML and brand JSON.",
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
    },
    {
      name: "extract_graphic_token",
      title: "Extract Graphic Token",
      description:
        "Uses Claude to extract a structured graphic_token JSON from the crawled page HTML and branding data.",
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
    },
    {
      name: "generate_placeholder_description",
      title: "Generate Placeholder Description",
      description:
        "New-flow-only helper: enriches a short image description with graphic_token brand context. Stormbreaker's production old-flow takes the description directly from Postgres page_info — the playground expects you to type it into the next step's input instead.",
      model: "claude-sonnet-4-5",
      provider: "portkey",
      diffOld: "skipped",
      diffNew: "new",
      inputs: [
        {
          name: "business_context_token",
          label: "Business Context Token",
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
      // Old flow is skipped for this step (stormbreaker has no equivalent);
      // new flow pulls its prompt from the new-flow repository.
      systemPromptNew:    GENERATE_PLACEHOLDER_DESCRIPTION_SYSTEM_PROMPT,
      userPromptTemplate: GENERATE_PLACEHOLDER_DESCRIPTION_USER_TEMPLATE,
      outputType: "text",
    },
    {
      name: "build_image_prompt",
      title: "Build Image Prompt",
      description:
        "Mirrors stormbreaker's `generate_prompt` step — expands a short image description into a photorealistic prompt via Claude. Old flow: plain system prompt (matches production). New flow: BRAND IDENTITY block from graphic_token appended to the system prompt.",
      model: "claude-sonnet-4-6",
      provider: "portkey",
      diffOld: "same_as_old",
      diffNew: "modified",
      inputs: [
        {
          name: "placeholder_description",
          label: "Image Description",
          source: {
            kind: "step_output",
            stepName: "generate_placeholder_description",
          },
          required: true,
        },
        {
          name: "graphic_token",
          label: "Graphic Token (new flow only)",
          source: { kind: "step_output", stepName: "extract_graphic_token" },
          required: false,
        },
      ],
      // Verbatim stormbreaker prompts: old = image_generation_system_prompt,
      // new = same + BRAND IDENTITY block from scripts/test_infographic_graphic_token.py.
      // User template matches services/replicate/replicate.py:115-118.
      systemPromptOld:    IMAGE_GENERATION_SYSTEM_PROMPT,
      systemPromptNew:    IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND,
      userPromptTemplate: BUILD_IMAGE_PROMPT_USER_TEMPLATE,
      outputType: "text_tagged",
    },
    {
      name: "generate_image",
      title: "Generate Image",
      description:
        "Sends the final prompt to Replicate (google/nano-banana-pro) to generate the image. Falls back to Google Gemini SDK if Replicate fails.",
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
    },
  ];
}

// ---------------------------------------------------------------------------
// PIPELINES — keyed as `${pageType}:${imageType}`
// ---------------------------------------------------------------------------

export const PIPELINES: Record<string, PipelineDefinition> = {
  "blog:thumbnail": {
    steps: makeSteps("BLOG:THUMBNAIL"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "1:1",
  },
  "blog:cover": {
    steps: makeSteps("BLOG:COVER"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "16:9",
  },
  "blog:internal": {
    steps: makeSteps("BLOG:INTERNAL"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "4:3",
  },
  "blog:external": {
    steps: makeSteps("BLOG:EXTERNAL"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "4:3",
  },
  "blog:infographic": {
    steps: makeSteps("BLOG:INFOGRAPHIC"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "1:1",
  },
  "blog:generic": {
    steps: makeSteps("BLOG:GENERIC"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "4:3",
  },
  "service:title": {
    steps: makeSteps("SERVICE:TITLE"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "16:9",
  },
  "service:h2": {
    steps: makeSteps("SERVICE:H2"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "4:3",
  },
  "category:industry": {
    steps: makeSteps("CATEGORY:INDUSTRY"),
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "16:9",
  },
};
