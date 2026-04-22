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
  /**
   * When set, this step calls Portkey's stored-prompt endpoint
   * (/v1/prompts/{id}/completions) with `promptVariables` mapped from
   * inputs — the prompt body + model live in the Portkey dashboard.
   * Matches stormbreaker's invoke_prompt_completion path for prompt IDs
   * like IMAGE_PLACEHOLDER / SERVICE_PAGE_CONTENT_GEN.
   */
  promptIdOld?: string;
  promptIdNew?: string;
  /**
   * Input names whose values are forwarded as Portkey prompt variables
   * when promptIdOld/promptIdNew is set. Each name here must also appear
   * in `inputs`. Defaults to every input's name.
   */
  promptVariables?: string[];
}

export interface ClientContextField {
  name: string;
  label: string;
  kind: "text" | "textarea" | "json" | "url" | "select";
  required: boolean;
  options?: string[];
  default?: string;
  /**
   * When true, the field is tucked behind an "Advanced stormbreaker inputs"
   * disclosure so the common context panel stays readable. Used for the
   * per-client JSON blobs (design_tokens, company_info, service_catalog,
   * product_information, paa_data, blog_content) that are large and
   * typically populated via the Import → Preset Client picker.
   */
  advanced?: boolean;
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
  // Always-visible fields
  { name: "client_homepage_url", label: "Client Homepage URL", kind: "url", required: true },
  {
    name: "business_context",
    label: "business_context.json",
    kind: "json",
    required: false,
  },
  { name: "company_logo_url", label: "Company Logo URL", kind: "url", required: false },
  { name: "graphic_token",    label: "Graphic Token Override (JSON)", kind: "json", required: false },
  {
    name: "aspect_ratio",
    label: "Aspect Ratio (override)",
    kind: "select",
    options: ["16:9", "1:1"],
    required: false,
  },

  // Advanced — populated by the Import → Preset picker for each of the 10
  // real client samples. These feed stormbreaker's SERVICE_PAGE_CONTENT_GEN /
  // CATEGORY_PAGE_CONTENT_GEN / IMAGE_PLACEHOLDER stored prompts.
  { name: "design_tokens_json",       label: "design_tokens (project.design_tokens)",          kind: "json",     required: false, advanced: true },
  { name: "company_info_json",        label: "company_info (project.company_info)",            kind: "json",     required: false, advanced: true },
  { name: "paa_data_json",            label: "paa_data (cluster.paa_data)",                    kind: "json",     required: false, advanced: true },
  { name: "service_catalog_json",     label: "service_catalog (resources where type='service')", kind: "json",   required: false, advanced: true },
  { name: "product_information_json", label: "product_information (resources where type='product')", kind: "json", required: false, advanced: true },
  { name: "blog_content_markdown",    label: "blog_content (markdown with block ids, for IMAGE_PLACEHOLDER)", kind: "textarea", required: false, advanced: true },
];

// ---------------------------------------------------------------------------
// Step factories — shared pieces (Steps 1, 2, 3, 5)
// ---------------------------------------------------------------------------

const scrapeStep: StepDefinition = {
  name: "scrape_client_site",
  title: "Scrape Client Site",
  description:
    "Crawls the client homepage with Firecrawl v2 `branding` format and returns the structured brand profile (colors, fonts, typography, logo, personality) plus page metadata and markdown. Playground-only helper for the new flow; stormbreaker reads this data from Postgres.",
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
    { name: "branding", label: "Branding", outputType: "json" },
    { name: "metadata", label: "Metadata", outputType: "json" },
    { name: "markdown", label: "Markdown", outputType: "text" },
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
      name: "markdown",
      label: "Markdown",
      source: { kind: "step_output", stepName: "scrape_client_site", field: "markdown" },
      required: true,
    },
    {
      name: "branding",
      label: "Branding",
      source: { kind: "step_output", stepName: "scrape_client_site", field: "branding" },
      required: true,
    },
  ],
  systemPromptNew:    EXTRACT_GRAPHIC_TOKEN_SYSTEM_PROMPT,
  userPromptTemplate: EXTRACT_GRAPHIC_TOKEN_USER_TEMPLATE,
  outputType: "json",
};

// ---------------------------------------------------------------------------
// Stormbreaker stored-prompt IDs (prod). Mirrors utils/constants.py:PortKeyPromptIDs.
// Every constant also has a dev counterpart (DevPortkeyPromptIDs); swap here
// if we ever want to test against dev.
// ---------------------------------------------------------------------------
const STORMBREAKER_PROMPTS = {
  IMAGE_PLACEHOLDER:            "pp-blog-image-07032e",
  SERVICE_PAGE_CONTENT_GEN:     "pp-service-pa-ab5621",
  CATEGORY_PAGE_CONTENT_GEN:    "pp-category-p-ba2554",
  EXTERNAL_IMAGE_UPDATION:      "pp-external-i-88e4d4",
  GOOGLE_SEARCH_QUERIES:        "pp-google-sea-dc6494",
} as const;

/** Blog-pipeline upstream step: mirrors stormbreaker's
 *  handlers/create_blog_pages/create_image_placeholders.py. Calls the
 *  `IMAGE_PLACEHOLDER` Portkey stored prompt with `{blog_content}` and
 *  returns a string containing one or more `<image_requirement>` tags.
 *  Downstream steps (Step 4 build/render/passthrough) extract the
 *  description from those tags. */
const generateBlogImagePlaceholdersStep: StepDefinition = {
  name: "generate_image_description",
  title: "Generate Image Placeholders",
  description:
    "Calls Portkey stored prompt IMAGE_PLACEHOLDER (pp-blog-image-07032e) exactly as stormbreaker's create_image_placeholders.py handler does. Input: the blog markdown (paste it into `blog_content_markdown` under Advanced). Output: one or more <image_requirement id type alt>description</image_requirement> tags, one per image the LLM decides to place.",
  model: "claude-sonnet-4-6 (via Portkey stored prompt)",
  provider: "portkey",
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "blog_content",
      label: "Blog Content (markdown)",
      source: { kind: "client_context", field: "blog_content_markdown" },
      required: true,
    },
  ],
  promptIdOld:     STORMBREAKER_PROMPTS.IMAGE_PLACEHOLDER,
  promptIdNew:     STORMBREAKER_PROMPTS.IMAGE_PLACEHOLDER,
  promptVariables: ["blog_content"],
  outputType: "text",
};

/** Service-pipeline upstream step: mirrors stormbreaker's
 *  handlers/create_pages/create_page_structure.py for page_type='service'.
 *  Calls SERVICE_PAGE_CONTENT_GEN (pp-service-pa-ab5621) with the same
 *  four variables `utils/page_structure.py:get_service_prompt_params`
 *  sends: topic, paa_data, service_catalog, company_info. Output is a
 *  full page_info JSON — downstream Step 4 auto-extracts the first
 *  image description via resolveInputs. */
const generateServicePageStructureStep: StepDefinition = {
  name: "generate_page_structure",
  title: "Generate Service Page Structure",
  description:
    "Calls Portkey stored prompt SERVICE_PAGE_CONTENT_GEN (pp-service-pa-ab5621) — the same prompt stormbreaker's create_page_structure.py handler runs for service pages. Variables come from the client's Advanced context fields; `topic` is pulled from Business Context.",
  model: "claude-sonnet-4-6 (via Portkey stored prompt)",
  provider: "portkey",
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    { name: "topic",            label: "topic",            source: { kind: "client_context", field: "business_context" },  required: true  },
    { name: "paa_data",         label: "paa_data",         source: { kind: "client_context", field: "paa_data_json" },           required: false },
    { name: "service_catalog",  label: "service_catalog",  source: { kind: "client_context", field: "service_catalog_json" },    required: false },
    { name: "company_info",     label: "company_info",     source: { kind: "client_context", field: "company_info_json" },       required: false },
  ],
  promptIdOld:     STORMBREAKER_PROMPTS.SERVICE_PAGE_CONTENT_GEN,
  promptIdNew:     STORMBREAKER_PROMPTS.SERVICE_PAGE_CONTENT_GEN,
  promptVariables: ["topic", "paa_data", "service_catalog", "company_info"],
  outputType: "json",
};

/** Category equivalent — matches `get_category_prompt_params`. */
const generateCategoryPageStructureStep: StepDefinition = {
  name: "generate_page_structure",
  title: "Generate Category Page Structure",
  description:
    "Calls Portkey stored prompt CATEGORY_PAGE_CONTENT_GEN (pp-category-p-ba2554) — the same prompt stormbreaker's create_page_structure.py handler runs for category pages. Variables: topic, paa_data, product_information, company_info.",
  model: "claude-sonnet-4-6 (via Portkey stored prompt)",
  provider: "portkey",
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    { name: "topic",               label: "topic",               source: { kind: "client_context", field: "business_context" },    required: true  },
    { name: "paa_data",            label: "paa_data",            source: { kind: "client_context", field: "paa_data_json" },             required: false },
    { name: "product_information", label: "product_information", source: { kind: "client_context", field: "product_information_json" }, required: false },
    { name: "company_info",        label: "company_info",        source: { kind: "client_context", field: "company_info_json" },         required: false },
  ],
  promptIdOld:     STORMBREAKER_PROMPTS.CATEGORY_PAGE_CONTENT_GEN,
  promptIdNew:     STORMBREAKER_PROMPTS.CATEGORY_PAGE_CONTENT_GEN,
  promptVariables: ["topic", "paa_data", "product_information", "company_info"],
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
      name: "business_context",
      label: "Business Context / Description",
      source: { kind: "client_context", field: "business_context" },
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
    "Mirrors stormbreaker's generate_prompt(amp_up=False) step — expands a short image description into a photorealistic prompt via Claude. Old flow: verbatim image_generation_system_prompt. New flow: same + BRAND IDENTITY block + business_context / company_info / aspect_ratio overrides.",
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
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
    },
    {
      name: "aspect_ratio",
      label: "aspect_ratio (new flow only; overrides pipeline default)",
      source: { kind: "client_context", field: "aspect_ratio" },
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
      label: "Blog Topic (→ {{blog_topic}} in template)",
      source: { kind: "client_context", field: "business_context" },
      required: true,
    },
    {
      name: "graphic_token",
      label: "Graphic Token (new flow only)",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
    },
    {
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
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
 *  selecting the best Pinecone match via GPT-4o. Input is sourced from
 *  generate_image_description (the upstream IMAGE_PLACEHOLDER call) by
 *  default — since IMAGE_PLACEHOLDER returns multiple <image_requirement>
 *  tags, use the per-input override to pick the specific description
 *  you want to send (or paste one into the Business Context field). */
const rawDescriptionStep_blog: StepDefinition = {
  name: "build_image_prompt",
  title: "Pass-Through Description",
  description:
    "Stormbreaker's internal-image flow does NOT run an LLM prompt-expansion step — the raw description from the <image_requirement> tag is sent straight to Replicate. The default input is the full output of Step 3 (all placeholder tags); override the input field to pick one description. New-flow context overrides (business_context, company_info, aspect_ratio) are surfaced as inputs so they can be forwarded to Replicate.",
  model: "(no model — pass-through)",
  provider: "none",
  renderOnly: true,
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "image_description",
      label: "Image Description (from <image_requirement>)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
    },
    {
      name: "aspect_ratio",
      label: "aspect_ratio (new flow only; overrides pipeline default)",
      source: { kind: "client_context", field: "aspect_ratio" },
      required: false,
    },
  ],
  systemPromptOld: "{{image_description}}",
  systemPromptNew: "{{image_description}}",
  outputType: "text",
};

/** Blog-specific variant of buildImagePromptStep_LLM: pulls the
 *  description from the IMAGE_PLACEHOLDER step output instead of the
 *  playground-only placeholder step. Used by blog:external and blog:generic.
 *  Matches stormbreaker's generic_images.py / external_images.py which read
 *  the description straight out of the <image_requirement> tag. */
const buildImagePromptStep_LLM_blog: StepDefinition = {
  ...buildImagePromptStep_LLM,
  inputs: [
    {
      name: "placeholder_description",
      label: "Image Description (from <image_requirement>)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
    },
    {
      name: "aspect_ratio",
      label: "aspect_ratio (new flow only; overrides pipeline default)",
      source: { kind: "client_context", field: "aspect_ratio" },
      required: false,
    },
  ],
};

/** Blog infographic variant: like buildImagePromptStep_LLM_blog but keeps
 *  graphic_token as input (no aspect_ratio override). Used by blog:infographic,
 *  whose new flow still threads the extracted brand token through. */
const buildImagePromptStep_LLM_blog_infographic: StepDefinition = {
  ...buildImagePromptStep_LLM,
  inputs: [
    {
      name: "placeholder_description",
      label: "Image Description (from <image_requirement>)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "graphic_token",
      label: "Graphic Token (new flow only)",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
    },
    {
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
    },
  ],
};

/** Service / category variant: sources the description from the
 *  SERVICE|CATEGORY_PAGE_CONTENT_GEN step output (resolveInputs walks
 *  the page_info JSON and picks the first non-certification image
 *  description). */
const buildImagePromptStep_LLM_page: StepDefinition = {
  ...buildImagePromptStep_LLM,
  inputs: [
    {
      name: "placeholder_description",
      label: "Image Description (from page_info.images[].description)",
      source: { kind: "step_output", stepName: "generate_page_structure" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context (new flow only)",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
    {
      name: "company_info",
      label: "company_info (new flow only)",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
    },
    {
      name: "aspect_ratio",
      label: "aspect_ratio (new flow only; overrides pipeline default)",
      source: { kind: "client_context", field: "aspect_ratio" },
      required: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// Pipeline composer
// ---------------------------------------------------------------------------

function makePipeline(opts: {
  /** Optional upstream description-generation step. Defaults to the
   *  playground-only `generatePlaceholderDescriptionStep` (new-flow only).
   *  Blog pipelines pass `generateBlogImagePlaceholdersStep` here so the
   *  old flow runs Portkey's IMAGE_PLACEHOLDER stored prompt exactly as
   *  stormbreaker's create_image_placeholders.py does. */
  step3?: StepDefinition;
  step4: StepDefinition;
  defaultAspectRatio: string;
  alignmentNote?: string;
}): PipelineDefinition {
  return {
    steps: [
      scrapeStep,
      extractGraphicTokenStep,
      opts.step3 ?? generatePlaceholderDescriptionStep,
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
    step3: generateBlogImagePlaceholdersStep,
    step4: rawDescriptionStep_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Old flow: Step 3 runs stormbreaker's IMAGE_PLACEHOLDER Portkey prompt to generate <image_requirement> tags (same as create_image_placeholders.py). Stormbreaker's full production pipeline then Pinecone-searches + GPT-4o-selects a match for img2img — neither is implemented here, so paste the matched image URL into Logo URL if you want img2img behavior.",
  }),

  // Blog external — complex SERP flow; playground runs the LLM approximation.
  "blog:external": makePipeline({
    step3: generateBlogImagePlaceholdersStep,
    step4: buildImagePromptStep_LLM_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Old flow: Step 3 runs IMAGE_PLACEHOLDER; Step 4 expands via Claude 4.6. Stormbreaker's full external flow between these two runs Serper image search + GPT-4o Vision + Claude Sonnet 4.5 selection + the EXTERNAL_IMAGE_UPDATION Portkey prompt — those are not yet wired in the playground.",
  }),

  // Blog infographic/generic — straight Claude 4.6 expansion + Replicate.
  "blog:infographic": makePipeline({
    step3: generateBlogImagePlaceholdersStep,
    step4: buildImagePromptStep_LLM_blog_infographic,
    defaultAspectRatio: "1:1",
    alignmentNote:
      "Matches stormbreaker end-to-end: Step 3 runs IMAGE_PLACEHOLDER (create_image_placeholders.py), Step 4 runs generate_prompt (replicate.py) and threads graphic_token + business_context + company_info into the brand-aware prompt, Step 5 runs Replicate with the logo as image_input.",
  }),
  "blog:generic": makePipeline({
    step3: generateBlogImagePlaceholdersStep,
    step4: buildImagePromptStep_LLM_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Same handler as Infographic in stormbreaker (generic_images.py); differs only by the `type` attribute on the <image_requirement> tag the LLM produces in Step 3.",
  }),

  // Service pipelines — upstream SERVICE_PAGE_CONTENT_GEN now wired.
  "service:title": makePipeline({
    step3: generateServicePageStructureStep,
    step4: buildImagePromptStep_LLM_page,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Old flow: Step 3 calls SERVICE_PAGE_CONTENT_GEN (pp-service-pa-ab5621) with topic + paa_data + service_catalog + company_info — identical variables to stormbreaker's get_service_prompt_params. Import → Preset picks one of the 10 sample clients to auto-fill paa_data / service_catalog / company_info. Step 4 expands the first page_info image description via Claude 4.6. Pinecone + amp-up (service-page refinement) are not implemented — on-miss path only.",
  }),
  "service:h2": makePipeline({
    step3: generateServicePageStructureStep,
    step4: buildImagePromptStep_LLM_page,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Same handler and upstream prompt as service:title (update_images.py). In stormbreaker the title vs h2 distinction only exists in each image object's `context` field within page_info.",
  }),

  "category:industry": makePipeline({
    step3: generateCategoryPageStructureStep,
    step4: buildImagePromptStep_LLM_page,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Old flow: Step 3 calls CATEGORY_PAGE_CONTENT_GEN (pp-category-p-ba2554) with topic + paa_data + product_information + company_info. Step 4 expands the first page_info image description via Claude 4.6. Pinecone + upscale-on-match is not implemented — on-miss path only.",
  }),
};
