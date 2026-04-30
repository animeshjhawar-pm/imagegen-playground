// ---------------------------------------------------------------------------
// Pipeline type definitions and per-image-type configuration.
//
// The nine (pageType × imageType) pipelines run through the same 5-step
// skeleton but swap in different Step 4 definitions so each combination
// follows stormbreaker's actual production flow (see docs/backend-context.md
// §2 and the per-type breakdowns below).
//
// Prompt organisation (per 2026-04-23 reshuffle):
//   - prompts-old-flow.ts / prompts-new-flow.ts — legacy monolithic files,
//     hold the frozen stormbreaker content + baseline new-flow prompts.
//   - old-flow/*.ts and new-flow/*.ts — per-step prompt modules for the
//     newer/iterating prompts (blog cover/thumbnail variants, infographic
//     new-flow prompt). Edit these without touching the monolithic files.
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
  BUILD_IMAGE_PROMPT_USER_TEMPLATE_PAGE,
} from "./prompts-new-flow";
import {
  BLOG_COVER_SYSTEM_PROMPT_OLD,
  BLOG_COVER_USER_TEMPLATE_OLD,
} from "./old-flow/cover-prompt";
import {
  GENERATE_INFOGRAPHIC_SYSTEM_PROMPT_NEW,
  GENERATE_INFOGRAPHIC_USER_TEMPLATE_NEW,
} from "./new-flow/generate-infographic-prompt";
import {
  BLOG_COVER_SYSTEM_PROMPT_NEW,
  BLOG_COVER_USER_TEMPLATE_NEW,
} from "./new-flow/cover-prompt";
import {
  CUSTOM_TESTER_SYSTEM_PROMPT,
  CUSTOM_TESTER_USER_TEMPLATE,
} from "./new-flow/custom-tester-prompt";
import {
  AMP_UP_SYSTEM_PROMPT_NEW,
  AMP_UP_USER_TEMPLATE_NEW,
  AMP_UP_SYSTEM_PROMPT_OLD,
  AMP_UP_USER_TEMPLATE_OLD,
} from "./new-flow/amp-up-prompt";

export type PageType = "blog" | "service" | "category" | "custom";

export type ImageType =
  | "cover_thumbnail"
  | "internal"
  | "external"
  | "infographic"
  | "generic"
  | "title"
  | "h2"
  | "industry"
  | "amp_up";

export type StepStatus = "idle" | "running" | "completed" | "failed";
export type StepDiff = "same_as_old" | "modified" | "new" | "skipped";
export type OutputType = "text" | "text_tagged" | "json" | "image_url" | "search_results";

export type StepInputSource =
  | { kind: "user_input" }
  | { kind: "step_output"; stepName: string; field?: string }
  | { kind: "config" }
  | { kind: "client_context"; field: string }
  /**
   * Pipeline-level constant. Pre-fills the input with the literal value;
   * the user can still override it per-run via the cell. Used by the
   * custom:cover tester pipeline to surface the fixed layout-reference
   * image URL as an editable input alongside the company logo.
   */
  | { kind: "literal"; value: string };

export interface StepInputDef {
  name: string;
  label: string;
  source: StepInputSource;
  /**
   * Optional override used when the surrounding flow is `"new"`. Falls
   * back to `source` for old flow (or when omitted). Lets a step share
   * an input name across flows while swapping where the prefill comes
   * from — e.g. page topic reads `business_context` in old flow and the
   * live page-image description in new flow.
   */
  sourceNew?: StepInputSource;
  required: boolean;
  /**
   * Fixed set of allowed values. When present, the playground UI
   * renders a <select> dropdown instead of the default textarea.
   * Currently only meaningful for user-selected inputs like
   * generate_image's `aspect_ratio`.
   */
  options?: string[];
  /**
   * For image-generation steps: when true, this input's value is
   * appended to the Replicate `image_input` array (in declaration
   * order) alongside the standard `image_input` field. Empty values
   * are skipped. Used by custom:cover to surface a second reference
   * URL slot next to the company logo.
   */
  imageInputMember?: boolean;
  /**
   * Restrict the input to specific flows. When omitted, the input is
   * shown in every flow. Use this to hide an input that's only wired
   * into one flow's user prompt (e.g. business_context / company_info
   * on Build Image Prompt are only consumed by the new-flow user
   * template, so they shouldn't clutter the old-flow cell).
   */
  flows?: ("old" | "new")[];
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
  /**
   * Default user-prompt template, shared across flows. When both
   * flows want the same per-run body, set this alone. If old and new
   * need different user prompts (e.g. old sends just a description,
   * new adds business_context + company_info), use the flow-specific
   * overrides below — each falls back to `userPromptTemplate`.
   */
  userPromptTemplate?: string;
  userPromptTemplateOld?: string;
  userPromptTemplateNew?: string;
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
   * Per-flow render-only templates. When set on a renderOnly step,
   * these are interpolated as the step output instead of systemPromptOld
   * / systemPromptNew. Lets a step keep systemPromptOld / userPromptTemplateOld
   * for view-only purposes (the View Prompt button) while the actual
   * runtime template is something different (e.g. "{{some_url}}" to
   * just render an image URL). Used by service:amp_up's display cells
   * which show the prod amp-up old prompt via View Prompt but actually
   * render an image URL on screen.
   */
  renderTemplateOld?: string;
  renderTemplateNew?: string;
  /**
   * When true, a step that's skipped for the current flow renders an
   * empty cell instead of the "— Not in [Old/New] Flow —" placeholder.
   * Used by service:amp_up's refined-image step which the user wants
   * gone from the new-flow row entirely (no placeholder text).
   */
  hideWhenSkipped?: boolean;
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
   * When true, StepCell renders a custom picker UI: the input
   * `options_json` (a JSON-encoded array of strings) is shown as a
   * list of selectable cards, and the chosen value becomes the step's
   * output. No LLM / provider call. Used for Choose Image Description
   * on service and category pipelines — lets the user pick between
   * multiple pre-fetched image descriptions without the heavy page-
   * structure LLM round-trip.
   */
  picker?: boolean;
  /**
   * When true (and `picker` is also true), the picker UI additionally
   * renders a free-text area below the option cards so the user can
   * type their own description. Typed text wins over card selection.
   * Used on the blog pipeline where per-client option arrays aren't
   * always populated yet and the user wants to try ad-hoc ideas.
   */
  pickerAllowCustom?: boolean;
  /**
   * Input names whose values are forwarded as Portkey prompt variables
   * when promptIdOld/promptIdNew is set. Each name here must also appear
   * in `inputs`. Defaults to every input's name.
   */
  promptVariables?: string[];
  /**
   * For image-generation steps: when set, this aspect ratio is used
   * verbatim regardless of the pipeline default or any user override.
   * Lets the merged blog:cover_thumbnail pipeline run a 16:9 cover
   * step and a 3:2 thumbnail step off the same shared prompt.
   */
  fixedAspectRatio?: string;
  /**
   * Per-flow overrides for `fixedAspectRatio`. Used by the thumbnail
   * render step which targets 1:1 in the old flow and 3:2 in the new
   * flow (same prompt, different output size). Falls back to
   * `fixedAspectRatio` when the matching flow override is unset.
   */
  fixedAspectRatioOld?: string;
  fixedAspectRatioNew?: string;
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
  /** Optional per-flow overrides for defaultAspectRatio. When set,
   *  the matching flow row sends that ratio to Replicate regardless
   *  of `defaultAspectRatio`. Used by blog:thumbnail where old flow
   *  is locked to 1:1 and new flow to 3:2. Falls back to
   *  `defaultAspectRatio` when omitted. */
  defaultAspectRatioOld?: string;
  defaultAspectRatioNew?: string;
  /** Short note shown above the pipeline table — flags any gaps vs stormbreaker. */
  alignmentNote?: string;
  /**
   * When true, the old-flow row is hidden entirely and Compare buttons
   * are suppressed (there's nothing to compare against). Used by the
   * custom:cover tester pipeline which only exercises the new flow.
   */
  omitOldFlow?: boolean;
  /**
   * When true, the old-flow row stays visible but is treated as fully
   * pre-rendered: per-row "Run row" button hidden, per-cell "Run Step"
   * buttons hidden, Run All / column Run All silently skip the old
   * lane regardless of the chosen scope. Use for pipelines whose old
   * flow is purely display-driven (every step is renderOnly with auto-
   * render). Currently service:amp_up.
   */
  oldFlowReadOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Image types per page type
// ---------------------------------------------------------------------------

export const IMAGE_TYPES_BY_PAGE: Record<PageType, ImageType[]> = {
  blog: ["cover_thumbnail", "internal", "external", "infographic", "generic"],
  service: ["title", "h2", "amp_up"],
  category: ["industry"],
  custom: ["cover_thumbnail"],
};

export const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  cover_thumbnail: "Cover + Thumbnail",
  internal: "Internal (vector DB)",
  external: "External (SERP search)",
  infographic: "Infographic",
  generic: "Generic",
  title: "Title Image",
  h2: "H2 Image",
  industry: "Industry Image",
  amp_up: "Amp Up (refine existing image)",
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

  // Advanced — populated by the Import → Preset picker for each of the 10
  // real client samples. These feed stormbreaker's SERVICE_PAGE_CONTENT_GEN /
  // CATEGORY_PAGE_CONTENT_GEN / IMAGE_PLACEHOLDER stored prompts.
  { name: "design_tokens_json",       label: "design_tokens (project.design_tokens)",          kind: "json",     required: false, advanced: true },
  { name: "company_info_json",        label: "company_info (project.company_info)",            kind: "json",     required: false, advanced: true },
  { name: "new_flow_service_topic_options",  label: "new_flow_service_topic_options (JSON array of page_info.images[].description from PUBLISHED service clusters)", kind: "json", required: false, advanced: true },
  { name: "new_flow_category_topic_options", label: "new_flow_category_topic_options (JSON array of page_info.industries[].images[].description where image_id LIKE 'generated-images/%')", kind: "json", required: false, advanced: true },
  { name: "new_flow_blog_topic_options",       label: "new_flow_blog_topic_options (JSON array — blog:cover / blog:thumbnail picker cards, sourced from clusters.topic)", kind: "json", required: false, advanced: true },
  { name: "new_flow_blog_infographic_options", label: "new_flow_blog_infographic_options (JSON array — blog:infographic picker cards)", kind: "json", required: false, advanced: true },
  { name: "new_flow_blog_internal_options",    label: "new_flow_blog_internal_options (JSON array — blog:internal picker cards)",       kind: "json", required: false, advanced: true },
  { name: "new_flow_blog_external_options",    label: "new_flow_blog_external_options (JSON array — blog:external picker cards)",       kind: "json", required: false, advanced: true },
  { name: "new_flow_blog_generic_options",     label: "new_flow_blog_generic_options (JSON array — blog:generic picker cards)",         kind: "json", required: false, advanced: true },
  { name: "new_flow_amp_up_rows",              label: "new_flow_amp_up_rows (JSON array — service:amp_up picker rows; each = {label, page_title, existing_image_url, existing_description, expected_description, amped_image_url})", kind: "json", required: false, advanced: true },
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

/**
 * Shared picker step for service + category pipelines. Replaces the
 * old LLM-backed `generate_page_structure` Portkey calls (SERVICE /
 * CATEGORY_PAGE_CONTENT_GEN). We no longer need the heavy page_info
 * round-trip — the prefetched `*_image_descriptions` arrays feed a
 * simple radio-card UI where the user picks which description flows
 * into Build Image Prompt. Same step in both flows: the page-structure
 * LLM was used identically in old and new, and swapping it for the
 * picker collapses the old/new distinction here.
 *
 * `name` stays `generate_page_structure` so downstream Build Image
 * Prompt wiring and saved flow state keep working.
 */
function makeChooseDescriptionStep(opts: {
  /** Step name. Defaults to "generate_page_structure" for service/category
   *  pipelines where the downstream Build Image Prompt references that
   *  step_output. Blog uses "generate_image_description" (existing
   *  downstream wiring). */
  name?: string;
  title: string;
  description: string;
  optionsField: string;
  /** When true the picker UI also shows a textarea for custom input. */
  allowCustom?: boolean;
}): StepDefinition {
  return {
    name: opts.name ?? "generate_page_structure",
    title: opts.title,
    description: opts.description,
    model: "(picker — no LLM)",
    provider: "none",
    renderOnly: true,
    picker: true,
    pickerAllowCustom: opts.allowCustom ?? false,
    diffOld: "same_as_old",
    diffNew: "same_as_old",
    inputs: [
      {
        name: "options_json",
        label: "Available image descriptions (JSON array)",
        source: { kind: "client_context", field: opts.optionsField },
        required: false,
      },
    ],
    // renderOnly contract: when the step "runs", the interpolated
    // systemPromptOld is returned as-is. For the picker we don't
    // actually run (StepCell sets output directly on click), but if
    // something does invoke the run path we want the first option
    // out rather than the raw JSON blob.
    systemPromptOld: "{{options_json}}",
    systemPromptNew: "{{options_json}}",
    outputType: "text",
  };
}

const chooseServiceDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  title: "Choose Image Description",
  description:
    "Pick an image description from the project's PUBLISHED service clusters (page_info.images[].description, most recent cluster first, deduped). The selected value is fed into Build Image Prompt. First option is the default — no click needed to use it.",
  optionsField: "new_flow_service_topic_options",
});

const chooseCategoryDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  title: "Choose Image Description",
  description:
    "Pick an image description from the project's category clusters (page_info.industries[].images[].description where image_id starts with 'generated-images/'). The selected value is fed into Build Image Prompt. First option is the default.",
  optionsField: "new_flow_category_topic_options",
});

/**
 * Blog picker. Keeps the `generate_image_description` step name so
 * the downstream blog Step 4 wiring (which used to point at the
 * IMAGE_PLACEHOLDER Portkey call) still resolves. Per-client options
 * are populated manually (blogImageDescriptionOptions), and the
 * picker exposes a free-text area so the user can type a description
 * even before options exist.
 */
/**
 * Blog Step 3 pickers. Each blog image type reads its own curated
 * options array so the cards surface image-type-relevant descriptions
 * (infographic vs internal photo vs external stock vs generic). All
 * variants share the same step name so downstream Step 4 wiring (which
 * reads `step_output.generate_image_description`) stays flow-agnostic.
 */
const chooseBlogImageDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  name: "generate_image_description",
  title: "Choose Blog Topic",
  description:
    "Pick one of the 5 blog topics pulled from clusters.topic (page_type='blog') for this client, or type your own. Used by blog:cover and blog:thumbnail as the seed for Step 4's cover/thumbnail prompt in both old and new flow. Selection is shared across flows.",
  optionsField: "new_flow_blog_topic_options",
  allowCustom: true,
});
const chooseBlogInfographicDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  name: "generate_image_description",
  title: "Choose Infographic Description",
  description:
    "Pick an infographic description from curated options (blogImageDescriptionOptions.infographic), or type your own. Feeds both old and new flow's Generate Image Prompt.",
  optionsField: "new_flow_blog_infographic_options",
  allowCustom: true,
});
const chooseBlogInternalDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  name: "generate_image_description",
  title: "Choose Internal Image Description",
  description:
    "Pick an internal-image description (blogImageDescriptionOptions.internal), or type your own.",
  optionsField: "new_flow_blog_internal_options",
  allowCustom: true,
});
const chooseBlogExternalDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  name: "generate_image_description",
  title: "Choose External Image Description",
  description:
    "Pick an external-image description (blogImageDescriptionOptions.external), or type your own.",
  optionsField: "new_flow_blog_external_options",
  allowCustom: true,
});
const chooseBlogGenericDescriptionStep: StepDefinition = makeChooseDescriptionStep({
  name: "generate_image_description",
  title: "Choose Generic Image Description",
  description:
    "Pick a generic-image description (blogImageDescriptionOptions.generic), or type your own.",
  optionsField: "new_flow_blog_generic_options",
  allowCustom: true,
});

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

/**
 * Factory for the Generate Image step. `aspectOptions` controls whether
 * the aspect_ratio dropdown appears at all:
 *   - Blog pipelines pass ["16:9", "1:1", "3:2"] so the user can pick
 *     any of the three common aspect ratios per-run.
 *   - Service + category pipelines pass `undefined` so the dropdown is
 *     hidden entirely; the pipeline's defaultAspectRatio ("1:1") is the
 *     only ratio used for those page types.
 */
function makeGenerateImageStep(opts: {
  aspectOptions?: string[];
  /** Overrides the default step name "generate_image". Used by the
   *  merged blog:cover_thumbnail pipeline to run two image-gen steps
   *  side-by-side ("generate_cover_image" + "generate_thumbnail_image")
   *  so each output lands in its own cell + gets its own Compare View. */
  name?: string;
  /** Overrides the default title "Generate Image". */
  title?: string;
  /** When set, this ratio is always used — the aspect_ratio input is
   *  hidden and the backend hardcodes it regardless of the pipeline
   *  default. */
  fixedAspectRatio?: string;
  /** Per-flow overrides for `fixedAspectRatio`. Thumbnail uses this:
   *  old flow = 1:1, new flow = 3:2. */
  fixedAspectRatioOld?: string;
  fixedAspectRatioNew?: string;
}): StepDefinition {
  const inputs: StepInputDef[] = [
    {
      name: "final_prompt",
      label: "Final Prompt",
      source: { kind: "step_output", stepName: "build_image_prompt" },
      required: true,
    },
    {
      name: "image_input",
      label: "Logo URL",
      source: { kind: "client_context", field: "company_logo_url" },
      required: false,
    },
  ];
  if (opts.aspectOptions && opts.aspectOptions.length > 0) {
    inputs.push({
      name: "aspect_ratio",
      label: "aspect_ratio (overrides pipeline default)",
      source: { kind: "user_input" },
      required: false,
      options: opts.aspectOptions,
    });
  }
  const hasDropdown = !!opts.aspectOptions && opts.aspectOptions.length > 0;
  const aspectSummary =
    opts.fixedAspectRatioOld || opts.fixedAspectRatioNew
      ? `old=${opts.fixedAspectRatioOld ?? opts.fixedAspectRatio ?? "—"}, new=${opts.fixedAspectRatioNew ?? opts.fixedAspectRatio ?? "—"}`
      : opts.fixedAspectRatio ?? null;
  const description = aspectSummary
    ? `Sends the final prompt to Replicate. Logo (if provided) is passed as image_input for img2img. aspect_ratio hardcoded per flow (${aspectSummary}).`
    : hasDropdown
      ? "Sends the final prompt to Replicate. Logo (if provided) is passed as image_input for img2img. aspect_ratio defaults to the pipeline's configured value and can be overridden per-run."
      : "Sends the final prompt to Replicate. Logo (if provided) is passed as image_input for img2img. aspect_ratio is fixed to the pipeline default (1:1) for service + category pipelines.";
  return {
    name: opts.name ?? "generate_image",
    title: opts.title ?? "Generate Image",
    description,
    model: "google/nano-banana-pro",
    provider: "replicate",
    diffOld: "same_as_old",
    diffNew: "same_as_old",
    inputs,
    outputType: "image_url",
    fixedAspectRatio: opts.fixedAspectRatio,
    fixedAspectRatioOld: opts.fixedAspectRatioOld,
    fixedAspectRatioNew: opts.fixedAspectRatioNew,
  };
}

const generateImageStep_blog: StepDefinition = makeGenerateImageStep({
  aspectOptions: ["16:9", "1:1", "3:2"],
});
const generateImageStep_page: StepDefinition = makeGenerateImageStep({
  // No dropdown — service/category are locked to the pipeline default.
});

/** Merged blog cover+thumbnail pipeline: two image-gen steps run off
 *  the same Build Image Prompt output, each hardcoded to its target
 *  aspect ratio. Cover = 16:9, Thumbnail = 3:2. */
const generateCoverImageStep: StepDefinition = makeGenerateImageStep({
  name: "generate_cover_image",
  title: "Generate Cover Image",
  fixedAspectRatio: "16:9",
});
const generateThumbnailImageStep: StepDefinition = makeGenerateImageStep({
  name: "generate_thumbnail_image",
  title: "Generate Thumbnail Image",
  // Per-flow override: old flow keeps the historical 1:1 thumbnail,
  // new flow produces the wider 3:2. Cover stays 16:9 in both flows.
  fixedAspectRatioOld: "1:1",
  fixedAspectRatioNew: "3:2",
});

/** Resolves the effective fixed aspect ratio for an image-gen step in
 *  the context of a specific flow. Returns `undefined` when the step
 *  doesn't hardcode a ratio (i.e. it honours the pipeline default or
 *  the user's dropdown choice). */
export function resolveFixedAspectRatio(
  step: StepDefinition,
  flowType: "old" | "new",
): string | undefined {
  const flowSpecific =
    flowType === "old" ? step.fixedAspectRatioOld : step.fixedAspectRatioNew;
  return flowSpecific ?? step.fixedAspectRatio;
}

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
    "Mirrors stormbreaker's generate_prompt(amp_up=False) step — expands a short image description into a photorealistic prompt via Claude. Old flow: verbatim image_generation_system_prompt. New flow: same + BRAND IDENTITY block + business_context / company_info overrides.",
  model: "claude-sonnet-4-6",
  provider: "portkey",
  diffOld: "same_as_old",
  // The brand-aware variant has been the shipped new-flow behaviour for a
  // while now; no longer a fresh delta worth flagging as MODIFIED.
  diffNew: "same_as_old",
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
  // Brand block append has been shipped for a while — no longer a delta.
  diffNew: "same_as_old",
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
    "Stormbreaker's internal-image flow does NOT run an LLM prompt-expansion step — the raw description from the <image_requirement> tag is sent straight to Replicate. The default input is the full output of Step 3 (all placeholder tags); override the input field to pick one description. New-flow context overrides (business_context, company_info) are surfaced as inputs so they can be forwarded to Replicate.",
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
  ],
  systemPromptOld: "{{image_description}}",
  systemPromptNew: "{{image_description}}",
  outputType: "text",
};

/**
 * Unified blog Step 4 — "Generate Image Prompt".
 *
 * Replaces the prior split (buildImagePromptStep_LLM_blog for
 * external/generic, buildImagePromptStep_LLM_blog_infographic for
 * infographic, rawDescriptionStep_blog for internal). All four now
 * share the same LLM step with the same four inputs — placeholder
 * description (from the picker), business_context, company_info, and
 * graphic_token. The last three are new-flow-only: the old-flow cell
 * hides them, and the old-flow user prompt only carries the
 * description (via BUILD_IMAGE_PROMPT_USER_TEMPLATE).
 */
const generateImagePromptStep_blog: StepDefinition = {
  ...buildImagePromptStep_LLM,
  title: "Generate Image Prompt",
  description:
    "Expands the picked/typed image description into a photorealistic prompt via Claude, using the client's business_context, company_info, and graphic_token (extracted brand tokens) on the new-flow side. Old flow sends just the description (unchanged).",
  inputs: [
    {
      name: "placeholder_description",
      label: "Image Description (from picker / custom text)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context",
      source: { kind: "client_context", field: "business_context" },
      required: false,
      flows: ["new"],
    },
    {
      name: "company_info",
      label: "company_info",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
      flows: ["new"],
    },
    {
      name: "graphic_token",
      label: "graphic_token",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
      flows: ["new"],
    },
  ],
  // Old flow: send just the description (stormbreaker parity).
  // New flow: send the full tagged payload (same shape as the page
  // variant) so the upgraded system prompt can ground on brand + biz.
  userPromptTemplateOld: BUILD_IMAGE_PROMPT_USER_TEMPLATE,
  userPromptTemplateNew: BUILD_IMAGE_PROMPT_USER_TEMPLATE_PAGE,
};

/**
 * blog:infographic Step 4. Inputs are identical to
 * generateImagePromptStep_blog, but the system prompt + user template
 * differ per flow:
 *   - Old flow: reuses IMAGE_GENERATION_SYSTEM_PROMPT (same as the
 *     generic blog variant).
 *   - New flow: uses the dedicated GENERATE_INFOGRAPHIC_SYSTEM_PROMPT_NEW
 *     (lives in src/config/new-flow/generate-infographic-prompt.ts).
 */
const generateInfographicPromptStep_blog: StepDefinition = {
  ...generateImagePromptStep_blog,
  title: "Generate Infographic Prompt",
  description:
    "Expands the picked/typed image description into an infographic-oriented prompt. Old flow reuses the generic IMAGE_GENERATION_SYSTEM_PROMPT; new flow uses the dedicated generate_infographic system prompt. New-flow user template also carries client_homepage_url for footer attribution.",
  inputs: [
    ...generateImagePromptStep_blog.inputs,
    {
      name: "client_homepage_url",
      label: "client_homepage_url",
      source: { kind: "client_context", field: "client_homepage_url" },
      required: false,
      flows: ["new"],
    },
  ],
  systemPromptOld: IMAGE_GENERATION_SYSTEM_PROMPT,
  systemPromptNew: GENERATE_INFOGRAPHIC_SYSTEM_PROMPT_NEW,
  userPromptTemplateOld: BUILD_IMAGE_PROMPT_USER_TEMPLATE,
  userPromptTemplateNew: GENERATE_INFOGRAPHIC_USER_TEMPLATE_NEW,
};

/**
 * Step 4 for the merged blog:cover_thumbnail pipeline. A single Build
 * Image Prompt step drives BOTH the 16:9 cover and 3:2 thumbnail
 * image-gen steps that follow. Prompt content comes from cover-prompt.ts
 * (old-flow uses the old stormbreaker cover template; new-flow uses the
 * iterated cover prompt in new-flow/cover-prompt.ts — the user asked to
 * consolidate thumbnail onto the cover prompt).
 */
const generateCoverImagePromptStep_blog: StepDefinition = {
  ...generateImagePromptStep_blog,
  title: "Generate Image Prompt",
  description:
    "Shared cover/thumbnail prompt — one Claude call produces the prompt used for both the 16:9 cover render and the 3:2/1:1 thumbnail render. Old flow: stormbreaker cover template. New flow: the iterated cover prompt. company_info is intentionally omitted on this pipeline; cover/thumbnail ground on blog_title + business_context + graphic_token only.",
  // Override inherited inputs: drop company_info (not consumed by the
  // cover template in either flow) and add the optional subtitle +
  // category_label user inputs that the new-flow template uses for the
  // top-of-card pill + tagline. Both default to empty — the system
  // prompt treats empty strings as "not provided".
  inputs: [
    {
      name: "placeholder_description",
      label: "Blog Title (from picker / custom text)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context",
      source: { kind: "client_context", field: "business_context" },
      required: false,
      flows: ["new"],
    },
    {
      name: "graphic_token",
      label: "graphic_token",
      source: { kind: "step_output", stepName: "extract_graphic_token" },
      required: false,
      flows: ["new"],
    },
    {
      name: "subtitle",
      label: "subtitle (optional)",
      source: { kind: "user_input" },
      required: false,
      flows: ["new"],
    },
    {
      name: "category_label",
      label: "category_label (optional)",
      source: { kind: "user_input" },
      required: false,
      flows: ["new"],
    },
  ],
  systemPromptOld: BLOG_COVER_SYSTEM_PROMPT_OLD,
  systemPromptNew: BLOG_COVER_SYSTEM_PROMPT_NEW,
  userPromptTemplateOld: BLOG_COVER_USER_TEMPLATE_OLD,
  userPromptTemplateNew: BLOG_COVER_USER_TEMPLATE_NEW,
};

/**
 * Custom-tester Build Image Prompt step. New-flow only. One Claude
 * call produces a single prompt that drives BOTH the 16:9 cover render
 * and the 3:2 thumbnail render that follow. graphic_token is sourced
 * directly from client_context (the custom pipeline skips the scrape
 * + extract steps entirely; the token is either manually pasted or
 * pre-populated from sample.graphicTokenJson on preset import).
 *
 * Uses the dedicated CUSTOM_TESTER_SYSTEM_PROMPT / USER_TEMPLATE so
 * you can iterate on the tester independently of the blog cover
 * prompt — see src/config/new-flow/custom-tester-prompt.ts.
 */
const generateCustomCoverPromptStep: StepDefinition = {
  name: "build_image_prompt",
  title: "Generate Image Prompt",
  description:
    "Custom tester variant — uses its own dedicated prompt (custom-tester-prompt.ts). One Claude call produces a single prompt used for BOTH the 16:9 cover and 3:2 thumbnail renders that follow. graphic_token comes from client_context (manual paste or preset).",
  model: "claude-sonnet-4-6",
  provider: "portkey",
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "placeholder_description",
      label: "Blog Title (from picker / custom text)",
      source: { kind: "step_output", stepName: "generate_image_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context",
      source: { kind: "client_context", field: "business_context" },
      required: false,
      flows: ["new"],
    },
    {
      name: "graphic_token",
      label: "graphic_token (manual JSON / preset)",
      source: { kind: "client_context", field: "graphic_token" },
      required: false,
      flows: ["new"],
    },
  ],
  systemPromptNew: CUSTOM_TESTER_SYSTEM_PROMPT,
  userPromptTemplateNew: CUSTOM_TESTER_USER_TEMPLATE,
  outputType: "text",
};

/**
 * Custom-tester Generate Image steps. Two distinct renders driven by
 * the same Build Image Prompt output:
 *   - generate_cover_image: 16:9, uses public/cover.png as the layout
 *     reference (alongside the company logo).
 *   - generate_thumbnail_image: 3:2, uses public/thumbnail.png.
 * The reference URLs hot-link the GitHub raw blobs so they resolve over
 * the public internet even when the playground is only running locally
 * (Replicate fetches the references from its own infrastructure).
 */
const CUSTOM_COVER_REFERENCE_IMAGE_URL =
  "https://raw.githubusercontent.com/animeshjhawar-pm/imagegen-playground/main/public/cover.png";
const CUSTOM_THUMBNAIL_REFERENCE_IMAGE_URL =
  "https://raw.githubusercontent.com/animeshjhawar-pm/imagegen-playground/main/public/thumbnail.png";

const generateCustomCoverImageStep: StepDefinition = {
  ...makeGenerateImageStep({
    name: "generate_cover_image",
    title: "Generate Cover Image",
    fixedAspectRatio: "16:9",
  }),
  inputs: [
    {
      name: "final_prompt",
      label: "Final Prompt",
      source: { kind: "step_output", stepName: "build_image_prompt" },
      required: true,
    },
    {
      name: "image_input",
      label: "Logo URL",
      source: { kind: "client_context", field: "company_logo_url" },
      required: false,
    },
    {
      name: "reference_image_url",
      label: "Reference Image URL (cover.png — layout scaffold)",
      source: { kind: "literal", value: CUSTOM_COVER_REFERENCE_IMAGE_URL },
      required: false,
      imageInputMember: true,
    },
  ],
};

const generateCustomThumbnailImageStep: StepDefinition = {
  ...makeGenerateImageStep({
    name: "generate_thumbnail_image",
    title: "Generate Thumbnail Image",
    fixedAspectRatio: "3:2",
  }),
  inputs: [
    {
      name: "final_prompt",
      label: "Final Prompt",
      source: { kind: "step_output", stepName: "build_image_prompt" },
      required: true,
    },
    {
      name: "image_input",
      label: "Logo URL",
      source: { kind: "client_context", field: "company_logo_url" },
      required: false,
    },
    {
      name: "reference_image_url",
      label: "Reference Image URL (thumbnail.png — layout scaffold)",
      source: { kind: "literal", value: CUSTOM_THUMBNAIL_REFERENCE_IMAGE_URL },
      required: false,
      imageInputMember: true,
    },
  ],
};

/** Service / category variant: sources the description from the
 *  Choose Image Description picker step output.
 *
 *  Old-flow user prompt = the shared minimal `{"description": "..."}`
 *  template — mirrors stormbreaker's production pipeline where Step 4
 *  only sees the raw description.
 *
 *  New-flow user prompt = BUILD_IMAGE_PROMPT_USER_TEMPLATE_PAGE, which
 *  adds business_context + company_info in XML-tagged sections so the
 *  upgraded system prompt can ground the photorealistic prompt in the
 *  client's actual business. */
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
      label: "business_context",
      source: { kind: "client_context", field: "business_context" },
      required: false,
      flows: ["new"],
    },
    {
      name: "company_info",
      label: "company_info",
      source: { kind: "client_context", field: "company_info_json" },
      required: false,
      flows: ["new"],
    },
  ],
  userPromptTemplateOld: BUILD_IMAGE_PROMPT_USER_TEMPLATE,
  userPromptTemplateNew: BUILD_IMAGE_PROMPT_USER_TEMPLATE_PAGE,
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
  /** Which Generate Image variant to use. Blog pipelines keep the
   *  aspect_ratio dropdown (16:9 / 1:1 / 3:2); service + category
   *  pipelines use the no-dropdown variant locked to pipeline default. */
  step5?: StepDefinition;
  defaultAspectRatio: string;
  defaultAspectRatioOld?: string;
  defaultAspectRatioNew?: string;
  alignmentNote?: string;
  /**
   * When true, omit the Firecrawl scrape + extract_graphic_token steps
   * from the pipeline. Use for pipelines whose downstream Build Image
   * Prompt step doesn't actually consume the graphic_token output —
   * currently service:title, service:h2, category:industry. The
   * pipeline starts directly from step3 (the picker).
   */
  noScrapeAndExtract?: boolean;
}): PipelineDefinition {
  return {
    steps: [
      ...(opts.noScrapeAndExtract ? [] : [scrapeStep, extractGraphicTokenStep]),
      opts.step3 ?? generatePlaceholderDescriptionStep,
      opts.step4,
      opts.step5 ?? generateImageStep_blog,
    ],
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: opts.defaultAspectRatio,
    defaultAspectRatioOld: opts.defaultAspectRatioOld,
    defaultAspectRatioNew: opts.defaultAspectRatioNew,
    alignmentNote: opts.alignmentNote,
  };
}

// ---------------------------------------------------------------------------
// service:amp_up — refines an existing image to match a new requirement
// ---------------------------------------------------------------------------
//
// Step 1 — Pick Amp-Up Row. Picker over new_flow_amp_up_rows; each option
// is a JSON-stringified object carrying { label, page_title,
// existing_image_url, existing_description, expected_description,
// amped_image_url }. Picker output is the full JSON; downstream steps
// pluck specific fields via source.field.
//
// Step 2 — Build Amp-Up Prompt. NEW FLOW ONLY (old flow skipped). Runs
// Claude with existing_description + expected_description +
// business_context + company_logo_url. Produces the final amp-up
// prompt that Replicate consumes.
//
// Step 3 — Generate Image. Old flow renders the row's pre-existing
// amped_image_url verbatim (display-only, no Replicate call). New flow
// hits Replicate with the LLM prompt and image_input = [
// existing_image_url, company_logo_url ].

const pickAmpUpRowStep: StepDefinition = {
  name: "pick_amp_up_row",
  title: "Pick Amp-Up Row",
  description:
    "Picker over the client's amp_up rows (existing image + descriptions + pre-rendered amped URL). Selection drives both the old flow's display-only image and the new flow's Build Amp-Up Prompt run.",
  model: "(picker — no LLM)",
  provider: "none",
  renderOnly: true,
  picker: true,
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "options_json",
      label: "Available amp_up rows (JSON array)",
      source: { kind: "client_context", field: "new_flow_amp_up_rows" },
      required: false,
    },
  ],
  systemPromptOld: "{{options_json}}",
  systemPromptNew: "{{options_json}}",
  outputType: "text",
};

// Step 4 (NEW flow only) — Build Amp-Up Prompt. Runs Claude with three
// inputs (existing_description, expected_description, business_context)
// to produce the image-generation prompt that Step 5 sends to Replicate.
// The logo URL is NOT an input here — it goes directly into Replicate's
// image_input array at Step 5.
const buildAmpUpPromptStep: StepDefinition = {
  name: "build_image_prompt",
  title: "Build Amp-Up Prompt",
  description:
    "New flow only — generates the image prompt using the picker row's input image description + expected image description + the client's business_context. Old flow skips this step.",
  model: "claude-sonnet-4-6",
  provider: "portkey",
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "existing_description",
      label: "Input Image Description",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "existing_description" },
      required: false,
    },
    {
      name: "expected_description",
      label: "Expected Image Description",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "expected_description" },
      required: true,
    },
    {
      name: "business_context",
      label: "business_context",
      source: { kind: "client_context", field: "business_context" },
      required: false,
    },
  ],
  systemPromptNew: AMP_UP_SYSTEM_PROMPT_NEW,
  userPromptTemplateNew: AMP_UP_USER_TEMPLATE_NEW,
  outputType: "text",
};

// Step 2 — Show Input Image (shared). Display-only cell that auto-renders
// the picked row's existing image URL. The cell also surfaces the
// existing description as an input (visible in the cell's input panel).
const showAmpUpInputImageStep: StepDefinition = {
  name: "show_input_image",
  title: "Input Image",
  description:
    "Display-only — shows the existing (matched) image URL and its alt-text description from the picked row. No provider call. Auto-renders as soon as the picker has a selection (both flows).",
  model: "(no model — display-only)",
  provider: "none",
  renderOnly: true,
  diffOld: "same_as_old",
  diffNew: "same_as_old",
  inputs: [
    {
      name: "existing_image_url",
      label: "Input Image URL",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "existing_image_url" },
      required: false,
    },
    {
      name: "existing_description",
      label: "Input Image Description",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "existing_description" },
      required: false,
    },
  ],
  // Render the existing image URL as the cell output (auto-runs via
  // the StepCell renderOnly+image_url useEffect). systemPrompt fields
  // intentionally left empty so the View Prompt button doesn't show
  // — there's no prompt content to surface here.
  renderTemplateOld: "{{existing_image_url}}",
  renderTemplateNew: "{{existing_image_url}}",
  outputType: "image_url",
};

// Step 3 (OLD flow only) — Refined Image. Display the row's pre-rendered
// amped URL verbatim. New flow skips this AND hides the cell entirely
// (hideWhenSkipped=true), so the new-flow row has no Refined Image
// placeholder. View Prompt on the old-flow cell shows the prod amp-up
// system + user templates (AMP_UP_*_OLD) for reference — those don't
// drive the runtime render (renderTemplateOld does).
const showAmpUpRefinedImageStep: StepDefinition = {
  name: "show_refined_image",
  title: "Refined Image",
  description:
    "Old flow only — displays the row's pre-rendered amped image URL. New flow hides this cell entirely (the new-flow refined image is the Generate Amp-Up Image step's output). View Prompt surfaces the prod amp-up old-flow prompt for reference — it's view-only and does NOT drive the rendering.",
  model: "(no model — display-only)",
  provider: "none",
  renderOnly: true,
  hideWhenSkipped: true,
  diffOld: "same_as_old",
  diffNew: "skipped",
  inputs: [
    {
      name: "amped_image_url",
      label: "Refined Image URL",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "amped_image_url" },
      required: false,
    },
    {
      name: "existing_description",
      label: "existing_description (for View Prompt only)",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "existing_description" },
      required: false,
    },
    {
      name: "expected_description",
      label: "expected_description (for View Prompt only)",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "expected_description" },
      required: false,
    },
  ],
  // Runtime render template — interpolates the URL out as the cell's output.
  renderTemplateOld: "{{amped_image_url}}",
  // View-Prompt content — the prod amp-up reference. NOT used at runtime.
  systemPromptOld:       AMP_UP_SYSTEM_PROMPT_OLD,
  userPromptTemplateOld: AMP_UP_USER_TEMPLATE_OLD,
  outputType: "image_url",
};

// Step 5 (NEW flow only) — Replicate. Calls nano-banana-pro at 1:1.
// image_input = [<existing_image_url from picker>, <company_logo_url>].
// Final prompt comes from the Build Amp-Up Prompt step output.
const ampUpGenerateImageStep: StepDefinition = {
  ...makeGenerateImageStep({
    name: "generate_image",
    title: "Generate Amp-Up Image",
    fixedAspectRatio: "1:1",
  }),
  diffOld: "skipped",
  diffNew: "new",
  inputs: [
    {
      name: "final_prompt",
      label: "Prompt (from Build Amp-Up Prompt)",
      source: { kind: "step_output", stepName: "build_image_prompt" },
      required: true,
    },
    {
      name: "image_input",
      label: "Input Image URL",
      source: { kind: "step_output", stepName: "pick_amp_up_row", field: "existing_image_url" },
      required: false,
    },
    {
      name: "logo_url",
      label: "Logo URL",
      source: { kind: "client_context", field: "company_logo_url" },
      required: false,
      imageInputMember: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PIPELINES — keyed as `${pageType}:${imageType}`
// ---------------------------------------------------------------------------

export const PIPELINES: Record<string, PipelineDefinition> = {
  // Blog cover/thumbnail — same picker + Generate Image Prompt pipeline
  // as blog:infographic. The only differences are the fixed aspect
  // ratios: cover = 16:9 (both flows); thumbnail = 1:1 old / 3:2 new.
  // Step 5 is the no-dropdown variant so the ratio stays fixed.
  // Merged blog Cover + Thumbnail pipeline. Steps 1–4 are shared across
  // the two outputs (scrape → extract → picker → one Build Image Prompt
  // run). Step 5 and 6 each take the same build_image_prompt output and
  // hit Replicate with a hardcoded aspect ratio: 16:9 for the cover, 3:2
  // for the thumbnail. This produces two image cells per flow (old + new)
  // and feeds two separate Compare Views (one per aspect ratio).
  "blog:cover_thumbnail": {
    steps: [
      scrapeStep,
      extractGraphicTokenStep,
      chooseBlogImageDescriptionStep,
      generateCoverImagePromptStep_blog,
      generateCoverImageStep,
      generateThumbnailImageStep,
    ],
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Cover + Thumbnail are merged: one shared picker + prompt (cover-prompt.ts in new-flow) drives two Replicate calls — 16:9 cover and 3:2 thumbnail. Each image gets its own cell per flow and its own Compare View.",
  },

  // Blog internal/external/infographic/generic — unified flow.
  // Step 3 is a picker over per-client blogImageDescriptionOptions with
  // a free-text fallback; Step 4 is the LLM Generate Image Prompt with
  // 4 inputs (placeholder_description, business_context, company_info,
  // graphic_token). Stormbreaker's `type`-specific branching (SERP,
  // Pinecone, etc.) isn't wired here.
  "blog:internal": makePipeline({
    step3: chooseBlogInternalDescriptionStep,
    step4: generateImagePromptStep_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Step 3 picker reads blogImageDescriptionOptions.internal per client. Step 4 expands via Claude 4.6. Stormbreaker's production internal flow additionally Pinecone-searches + GPT-4o-selects a match for img2img — not implemented here.",
  }),
  "blog:external": makePipeline({
    step3: chooseBlogExternalDescriptionStep,
    step4: generateImagePromptStep_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Step 3 picker reads blogImageDescriptionOptions.external per client. Stormbreaker's full external flow additionally runs Serper image search + GPT-4o Vision + Claude Sonnet 4.5 selection + the EXTERNAL_IMAGE_UPDATION Portkey prompt — those aren't wired here.",
  }),
  "blog:infographic": makePipeline({
    step3: chooseBlogInfographicDescriptionStep,
    step4: generateInfographicPromptStep_blog,
    // No-dropdown Step 5 so the aspect ratio is locked to 16:9 in both
    // flows. User-facing header just shows "Generate Image" + "16:9".
    step5: generateImageStep_page,
    defaultAspectRatio: "16:9",
    alignmentNote:
      "Step 3 picker reads blogImageDescriptionOptions.infographic per client. Old flow Step 4 reuses the generic IMAGE_GENERATION_SYSTEM_PROMPT; new flow Step 4 uses the dedicated generate_infographic system prompt from new-flow/generate-infographic-prompt.ts. Aspect ratio fixed at 16:9 in both flows — no per-run dropdown.",
  }),
  "blog:generic": makePipeline({
    step3: chooseBlogGenericDescriptionStep,
    step4: generateImagePromptStep_blog,
    defaultAspectRatio: "4:3",
    alignmentNote:
      "Step 3 picker reads blogImageDescriptionOptions.generic per client. Same Step 4 handler as blog:external.",
  }),

  // Service pipelines — upstream SERVICE_PAGE_CONTENT_GEN now wired.
  "service:title": makePipeline({
    step3: chooseServiceDescriptionStep,
    step4: buildImagePromptStep_LLM_page,
    step5: generateImageStep_page,
    defaultAspectRatio: "1:1",
    noScrapeAndExtract: true,
    alignmentNote:
      "Three steps: pick description → Build Image Prompt → Generate Image. Scrape + extract_graphic_token are skipped — Build Image Prompt for this pipeline only consumes placeholder_description + business_context + company_info, never graphic_token.",
  }),
  "service:h2": makePipeline({
    step3: chooseServiceDescriptionStep,
    step4: buildImagePromptStep_LLM_page,
    step5: generateImageStep_page,
    defaultAspectRatio: "1:1",
    noScrapeAndExtract: true,
    alignmentNote:
      "Same pipeline as service:title (in stormbreaker the title vs h2 distinction is only a context label on each image). Three steps; scrape + extract skipped.",
  }),

  // Custom tester pipeline. New-flow only, 4 steps:
  //   1) Choose blog topic (picker over new_flow_blog_topic_options)
  //   2) Generate Image Prompt — runs Claude with placeholder_description
  //      + business_context + graphic_token (graphic_token comes from
  //      client_context — pre-populated from preset, or manually pasted —
  //      NOT from an extract step). No scrape, no extract, no company_info.
  //      Uses its own dedicated prompt (custom-tester-prompt.ts).
  //   3) Generate Cover Image — 16:9 render. image_input = [logo, cover.png].
  //   4) Generate Thumbnail Image — 3:2 render. image_input = [logo,
  //      thumbnail.png]. Both references are committed in /public and hot-
  //      linked from raw.githubusercontent.com so they resolve even when
  //      the playground only runs locally.
  "custom:cover_thumbnail": {
    steps: [
      chooseBlogImageDescriptionStep,
      generateCustomCoverPromptStep,
      generateCustomCoverImageStep,
      generateCustomThumbnailImageStep,
    ],
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "16:9",
    omitOldFlow: true,
    alignmentNote:
      "Custom tester pipeline — new flow only. 4 steps: pick topic → generate prompt (own template) → 16:9 cover render with cover.png reference + 3:2 thumbnail render with thumbnail.png reference. Logo is included in image_input alongside the per-render layout scaffold.",
  },

  // service:amp_up — five-step refine-existing-image pipeline.
  //   1. Pick Amp-Up Row    (shared)         picker over the client's
  //                                          ampUpRows
  //   2. Input Image        (shared)         display-only; auto-renders
  //                                          the picker row's existing
  //                                          image URL + description
  //   3. Refined Image      (OLD only)       display-only; auto-renders
  //                                          the row's pre-rendered
  //                                          amped URL. New flow skips.
  //   4. Build Amp-Up Prompt (NEW only)      Claude run with existing /
  //                                          expected descriptions +
  //                                          business_context. Old skips.
  //   5. Generate Amp-Up Image (NEW only)    Replicate at 1:1 with
  //                                          image_input = [picker
  //                                          existing_image_url,
  //                                          company_logo_url] and the
  //                                          Step-4 prompt. Old skips.
  // Old-flow run buttons: NONE — every old-flow cell auto-renders.
  "service:amp_up": {
    steps: [
      pickAmpUpRowStep,
      showAmpUpInputImageStep,
      showAmpUpRefinedImageStep,
      buildAmpUpPromptStep,
      ampUpGenerateImageStep,
    ],
    clientContextFields: SHARED_CLIENT_CONTEXT_FIELDS,
    defaultAspectRatio: "1:1",
    oldFlowReadOnly: true,
    alignmentNote:
      "Service amp-up tester. OLD flow is fully pre-filled (picker → input image → refined image, all auto-rendered, no run buttons). NEW flow runs Build Amp-Up Prompt then Generate Image at 1:1 against Replicate with image_input=[existing_image_url, logo]. Compare button shows OLD refined vs NEW generated.",
  },

  "category:industry": makePipeline({
    step3: chooseCategoryDescriptionStep,
    step4: buildImagePromptStep_LLM_page,
    step5: generateImageStep_page,
    defaultAspectRatio: "1:1",
    noScrapeAndExtract: true,
    alignmentNote:
      "Three steps: pick description → Build Image Prompt → Generate Image. Scrape + extract_graphic_token are skipped — Build Image Prompt for this pipeline only consumes placeholder_description + business_context + company_info, never graphic_token.",
  }),
};

// ---------------------------------------------------------------------------
// Disabled-step logic
// ---------------------------------------------------------------------------

/**
 * Steps that should stay runnable in the NEW flow of a service/category
 * pipeline even when its topic is missing. The scrape + graphic-token
 * extraction don't depend on the topic, so we let the user still exercise
 * them even for clients that have no published page to seed the topic from.
 */
const NEW_FLOW_TOPICLESS_RUNNABLE_STEPS = new Set([
  "scrape_client_site",
  "extract_graphic_token",
]);

/**
 * Returns the set of step names that should be rendered as disabled
 * (not runnable, greyed-out body) for a given (pipelineKey, flow).
 *
 * Rules — NEW flow gated only for service + category pipelines:
 *   - If the pipeline's `topic` source field is empty in client.context,
 *     the page isn't buildable.
 *     · OLD flow: disable every step (scrape/extract_graphic_token don't
 *       exist in old flow anyway, so the row effectively has no runnable
 *       steps).
 *     · NEW flow: disable every step EXCEPT scrape + extract_graphic_token
 *       so the user can still preview the early brand-extraction flow.
 *   - Otherwise no steps are disabled.
 *
 * Blog pipelines are not gated here (user manages their own blog flow).
 */
export function getDisabledStepsForFlow(
  pipelineKey: string,
  context: Record<string, string>,
  flowType: "old" | "new"
): Set<string> {
  // service:amp_up has its own gating (ampUpRows on the client) and
  // does NOT depend on new_flow_service_topic_options. Skip the topic
  // check entirely so the picker + image steps stay runnable for the
  // 5 amp-up tester clients (which intentionally have empty service
  // topic options).
  if (pipelineKey === "service:amp_up") return new Set();

  const topicField = pipelineKey.startsWith("service:")
    ? "new_flow_service_topic_options"
    : pipelineKey.startsWith("category:")
      ? "new_flow_category_topic_options"
      : null;
  if (!topicField) return new Set();

  // Options field is a JSON-encoded array; empty array or missing value
  // both mean "no topic available".
  const raw = (context[topicField] ?? "").trim();
  let hasTopic = false;
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      hasTopic = Array.isArray(arr) && arr.length > 0;
    } catch {
      hasTopic = false;
    }
  }
  if (hasTopic) return new Set();

  const pipeline = PIPELINES[pipelineKey];
  if (!pipeline) return new Set();
  if (flowType === "old") {
    return new Set(pipeline.steps.map((s) => s.name));
  }
  return new Set(
    pipeline.steps
      .filter((s) => !NEW_FLOW_TOPICLESS_RUNNABLE_STEPS.has(s.name))
      .map((s) => s.name)
  );
}
