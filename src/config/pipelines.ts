// ---------------------------------------------------------------------------
// Pipeline type definitions and configuration.
// Reference: docs/backend-context.md
// ---------------------------------------------------------------------------

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
// Shared system prompts (verbatim from docs/backend-context.md §4 Step 3)
// ---------------------------------------------------------------------------

const IMAGE_GEN_SYSTEM_PROMPT_OLD = `You are an expert AI Prompt Engineer specializing in creating detailed, photorealistic prompts for commercial marketing imagery. Your function is to take a single, concise business need and translate it into a rich, descriptive prompt that a generative AI model (like Midjourney or DALL-E 3) can use to create a high-quality, high-conversion image.

You will be given one input:
1. description: A concise description of the desired scene, subject, and mood.

Core Directives:
1. Photorealism and Commercial Quality: photorealistic, professional commercial photography, high-detail, 4K resolution, sharp focus. Lighting: bright and welcoming natural light, soft studio lighting, or warm golden-hour sunlight. Color: vibrant, rich, and inviting. Composition: eye-level view, medium shot, close-up, bokeh background.
2. The "Commercial Presence" Rule (Non-Negotiable): If people present — must look directly at camera, warm/confident/professional expression.
3. Elaborate on the Core Concept: expand user's description into a full scene.

Output Format:
<final_prompt>[Your generated prompt here]</final_prompt>`;

// New flow: same as old + BRAND IDENTITY block injected (mirrors test_infographic_graphic_token.py)
const IMAGE_GEN_SYSTEM_PROMPT_NEW = `${IMAGE_GEN_SYSTEM_PROMPT_OLD}

BRAND IDENTITY:
- Primary Color: {{primary_color}}
- Secondary Color: {{secondary_color}}
- Accent Color: {{accent_color}}
- Text Color: {{text_color}}
- Heading Font: {{heading_font}}
- Body Font: {{body_font}}
- Brand Style: {{brand_style}}
- Tagline: {{tagline}}
- Logo Style: {{logo_style}}
- Industry: {{industry}}

Incorporate these brand values into the visual design where appropriate.`;

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

function makeSteps(combinationKey: string): StepDefinition[] {
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
      // Placeholder prompt — backend uses a richer extraction pipeline; this keeps
      // the playground self-contained for comparison runs.
      systemPromptNew:
        "You are a brand analyst. Given the page HTML/markdown and any branding data scraped from a company homepage, extract a graphic_token JSON with the following fields: primary_color, secondary_color, accent_color, text_color, heading_font, body_font, brand_style (1–2 sentences on tone), tagline, logo_style (1 short phrase), industry. Return ONLY valid JSON — no prose, no code fences.",
      userPromptTemplate:
        "HTML / markdown:\n{{clean_html}}\n\nBranding data (may be partial or empty):\n{{branding_json}}",
      outputType: "json",
    },
    {
      name: "generate_placeholder_description",
      title: "Generate Placeholder Description",
      description:
        "Generates a short placeholder image description. Old flow: generic description. New flow: description enriched with graphic_token brand context.",
      model: "claude-sonnet-4-5",
      provider: "portkey",
      diffOld: "same_as_old",
      diffNew: "modified",
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
      // Placeholder prompts — backend uses per-image-type variants; these are
      // generic stand-ins for comparison.
      systemPromptOld: `[${combinationKey}] You are a copywriter for a B2B marketing site. Write a concise 1–2 sentence visual description that a photorealistic image generator can use. Focus on scene, subject, and mood. Do NOT reference brand colors, fonts, or typography. Return only the description — no preamble.`,
      systemPromptNew: `[${combinationKey}] You are a copywriter for a B2B marketing site. Write a concise 1–2 sentence visual description that a photorealistic image generator can use. Incorporate the brand identity from the graphic_token JSON (colors, style, tone) to make the description visually specific to this company. Return only the description — no preamble.`,
      userPromptTemplate:
        "Business context:\n{{business_context_token}}\n\nGraphic token (may be empty for old flow):\n{{graphic_token}}",
      outputType: "text",
    },
    {
      name: "build_image_prompt",
      title: "Build Image Prompt",
      description:
        "Expands the placeholder description into a full photorealistic image generation prompt using Claude. Old flow: no brand context. New flow: BRAND IDENTITY block injected.",
      model: "claude-sonnet-4-6",
      provider: "portkey",
      diffOld: "same_as_old",
      diffNew: "modified",
      inputs: [
        {
          name: "placeholder_description",
          label: "Placeholder Description",
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
      systemPromptOld: IMAGE_GEN_SYSTEM_PROMPT_OLD,
      systemPromptNew: IMAGE_GEN_SYSTEM_PROMPT_NEW,
      userPromptTemplate: '{ "description": "{{placeholder_description}}" }',
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
