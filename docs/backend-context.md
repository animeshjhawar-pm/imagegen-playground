# imagegen-playground — Context Reference Document
**Phase 1 output. Read-only extraction from `gw-backend-stormbreaker`.**
**Date: 2026-04-17. Do not start Phase 2 until explicitly instructed.**

---

## 1. Repo Overview

| Field | Value |
|---|---|
| Language | Python 3.10 (pinned in `.python-version`) |
| Package manager | `uv` (lockfile: `uv.lock`) |
| Deployment framework | Serverless Framework v3 (`serverless.yml`) |
| Infrastructure | AWS Lambda + AWS Step Functions |
| Database | PostgreSQL (via `aws-psycopg2`) |
| Vector store | Pinecone (hybrid dense+sparse) |
| Storage | AWS S3 + CDN (`file-host.link` prod / `cdn-dev.gushwork.ai` dev) |
| Key LLM dependencies | `anthropic>=0.40.0`, `portkey-ai>=2.0.0`, `google-genai>=1.54.0` |
| Key image dependencies | `replicate` (via HTTP), `google-genai` SDK |
| Linter/formatter | Ruff |
| Entry points | Individual Lambda handler functions per file |

### Directory layout (2 levels deep)

```
gw-backend-stormbreaker/
├── core/                    # Base Service class, decorators, IO service abstraction
│   ├── __init__.py
│   ├── decorators.py        # handler_wrapper decorator (Lambda entry point wrapper)
│   ├── service.py           # Service base class + ServiceResult
│   └── io_service/          # S3IOService (input/output data loading for blog pipeline)
├── handlers/                # Lambda handler functions (one per Lambda)
│   ├── create_pages/        # Service/category page creation handlers
│   │   ├── update_images.py        ← Main image pipeline entry for service/category
│   │   ├── create_page_structure.py
│   │   └── ...
│   ├── create_blog_pages/   # Blog page creation handlers
│   │   └── image_operations/
│   │       ├── cover_image.py      ← Blog cover image generation
│   │       ├── internal_images.py  ← Blog internal images (vector DB)
│   │       ├── external_images.py  ← Blog external images (SERP search)
│   │       ├── generic_images.py   ← Blog infographic/generic images
│   │       └── replace_images.py   ← Replaces placeholders in markdown
│   ├── update_pages/        # Page update handlers
│   │   └── process_image.py        ← Post-processing: copy+upscale image to CDN
│   ├── publish_pages/       # Interlinking, blog segregation
│   ├── create_project/      # Project initialization
│   ├── create_demo/         # Demo site generation
│   └── automated_keyword_research/
├── services/                # Reusable service integrations
│   ├── image/image.py              ← ImageService (core orchestrator)
│   ├── replicate/
│   │   ├── replicate.py            ← Replicate API client + prompt generation
│   │   └── upscale.py              ← Recraft Crisp Upscale service
│   ├── portkey/
│   │   ├── portkey.py              ← PortkeyArgs + invoke_portkey_api()
│   │   ├── completions.py          ← /v1/chat/completions path
│   │   └── responses.py            ← /v1/responses path (for GPT/o-series models)
│   ├── google/image_gen.py         ← Google Gemini SDK fallback for image gen
│   ├── pine_cone/pine_cone.py      ← Pinecone hybrid search client
│   ├── serper/serper.py            ← Serper image search (blog external images)
│   └── postgres/                   ← DB access layer
├── prompts/                 # All prompt strings
│   ├── image_gen.py                ← image_generation_system_prompt + amp_up_prompt_system_prompt
│   ├── image_description.py        ← image_description_prompt + get_select_best_image_prompt
│   ├── get_consolidated_image_metadata_prompt.py
│   └── demoware/image_generation.py  ← get_demo_image_generation_prompt
├── response_formats/        # JSON schema response format definitions
├── utils/
│   ├── constants.py                ← All model names, env vars, enums, config
│   └── utils.py                    ← Helpers (parse_dimension_to_nearest_allowed, etc.)
├── state-machines/
│   ├── create-pages.yml            ← Main page creation Step Functions definition
│   └── create-blog-page.yml
├── scripts/                 # Local test/comparison scripts (NOT deployed)
│   ├── test_brand_image.py         ← Old vs new (brand colors in description)
│   ├── test_brand_prompt.py
│   ├── test_infographic_graphic_token.py  ← Old vs new (graphic_token injection)
│   └── test_custom_metal_infographic.py   ← Old vs new (Firecrawl brand extraction)
└── serverless.yml           # Lambda + Step Functions deployment config
```

---

## 2. Pipeline Trace (End-to-End)

### 2A. Service & Category Pages (primary production pipeline)

**Entry point**: `handlers/create_pages/update_images.py:UpdateImagesService.execute()`
Triggered by Step Functions state `UpdateImages` (after `CreatePageStructure`).

```
[Step Functions: create-pages.yml]
  CreatePageStructure
       ↓
  UpdateImages  ←── handlers/create_pages/update_images.py:UpdateImagesService
       ├── 1. Load cluster.page_info from Postgres (contains image objects with description+context)
       ├── 2. Extract all image objects where context != "certification"
       ├── 3. Get certification images (static lookup from EXISTING_CERTIFICATION_IMAGES dict)
       │
       ├── 4. search_images_in_vector_db()
       │       ├── Query Pinecone (dense + sparse) for each image description
       │       └── For each result set → select_best_image() via GPT-4o
       │           ├── Match found  → images_for_amp_up (has existing image_url)
       │           └── No match     → images_for_generation
       │
       ├── 5a. [Service pages only] refine_images(images_for_amp_up)
       │       ├── Upscale each existing image with recraft-crisp-upscale
       │       └── generate_prompt(description, amp_up=True) → nano-banana-pro img2img
       │
       ├── 5b. [Category pages only] upscale_images(images_for_amp_up)
       │       └── Upscale with recraft-crisp-upscale (no re-generation)
       │
       ├── 6. generate_images(images_for_generation)
       │       ├── generate_prompt(description, amp_up=False) → LLM → <final_prompt>
       │       └── nano-banana-pro → image URL
       │
       ├── 7. Download images, convert to WebP (360/720/1080 resolutions), upload to S3
       │
       └── 8. save_images_to_page_info() → update cluster.page_info in Postgres
```

### 2B. Blog Pages (secondary pipeline)

**Entry point**: `handlers/create_blog_pages/image_operations/` — separate Lambda per image type.

```
[Step Functions: create-blog-page.yml]
  GenerateCoverImage        ← cover_image.py:CoverImageService
  GenerateInternalImages    ← internal_images.py:InternalImageService
  GenerateExternalImages    ← external_images.py:ExternalImageService
  InfographicImageService   ← generic_images.py:InfographicImageService

  All read from: S3 blog_with_image_placeholders.md
  (placeholder format: <image_requirement id="..." type="internal|external|infographic|generic" aspect_ratio="16:9" alt="...">description</image_requirement>)

  CoverImage flow:
    blog_topic → create_cover_image_prompt() → nano-banana-pro (with logo as image_input)
    [NOTE: No LLM prompt expansion step — prompt is hardcoded]
    → 16:9 + 1:1 variants in parallel

  InternalImage flow:
    description → Pinecone search → select_best_image (GPT-4o)
    ├── Match: nano-banana-pro img2img (prompt=raw description, image_input=best_url)
    └── No match: nano-banana-pro text-to-image (prompt=raw description)
    [NOTE: No LLM prompt expansion — description passed directly]

  ExternalImage flow:
    description → generate_google_search_queries() [PortKey pp-google-sea-*]
    → Serper image search (3 queries × 5 results = up to 15 URLs)
    → GPT-4o vision description for each URL
    → select_best_external_image() [Claude Sonnet 4.5]
    → generate_updation_prompt() [PortKey pp-external-i-*]
    → nano-banana-pro img2img (selected image as input)

  Infographic/Generic flow:
    description → generate_prompt() [LLM expansion, amp_up=False] → nano-banana-pro
    (same as service/category generate_images path, but with optional company_logo)
```

### 2C. Demo Pages (demoware pipeline)

```
  create_demo_payload() → get_demo_image_generation_prompt()
  → Claude Sonnet 4 (DEMO_IMAGE_PROMPT_GENERATION_MODEL)
  → extracts <generation_prompt> tag
  → prunaai/z-image-turbo (NOT nano-banana-pro)
```

---

## 3. Page Type → Image Type Mapping

### Service / Category pages (from `handlers/create_pages/update_images.py:190-205`)

| Page Type | Images from Vector DB match | Images with no DB match |
|---|---|---|
| `service` | **refined** (upscale → img2img amp-up) | **generated** (LLM prompt → text-to-image) |
| `category` | **refined** (upscale only, no re-generation) | **generated** (LLM prompt → text-to-image) |

All pages also support **certification** images (static SVG lookup, no generation).

**Filter logic** (`update_images.py:138,146`):
- `ignoreRevamp` in context → skip refinement, just upscale (service only)
- `ignoreGeneration` in context → skip generation entirely
- Context format: `"<description_of_role>#<aspect_ratio>[#ignoreRevamp][#ignoreGeneration]"`
- Certifications detected by `"certification"` substring in context

### Blog pages (from `external_images.py:parse_image_placements` + individual handlers)

| `image_type` attribute value | Handler | Generation method |
|---|---|---|
| `internal` | `InternalImageService` | Pinecone → GPT-4o select → nano-banana-pro (img2img or text) |
| `external` | `ExternalImageService` | Serper search → GPT-4o vision → Claude select → updation prompt → nano-banana-pro img2img |
| `infographic` | `InfographicImageService` | LLM prompt expansion → nano-banana-pro |
| `generic` | `InfographicImageService` (same handler) | LLM prompt expansion → nano-banana-pro |
| *(cover — not a placeholder type)* | `CoverImageService` | Hardcoded prompt → nano-banana-pro |

### Demo pages

| Page Type | Model |
|---|---|
| All demo pages | `prunaai/z-image-turbo` (via Replicate) |

---

## 4. Per-Step Breakdown

### Step 1: `search_images_in_vector_db`
- **File**: `services/image/image.py:352`
- **Description**: Searches Pinecone hybrid index for existing client images that match each image description. Uses thread pool for concurrent queries.
- **Provider**: Pinecone (no LLM here)
- **Indexes**: `bifrost-images-index` (dense), `bifrost-images-sparse-index` (sparse), namespace = `staging_subdomain`
- **Input fields**: `images_to_handle: list[tuple[str, str]]` (description, aspect_ratio), `project_id: str`, `staging_subdomain: str`
- **Output type**: Two lists — `images_for_amp_up` (has `image_url`), `images_for_generation`
- **Then calls**: `select_best_image()` for each result set that has hits

---

### Step 2: `select_best_image`
- **File**: `services/image/image.py:270`
- **Description**: Uses a vision-capable LLM to pick the single best matching image from up to 5 Pinecone hits.
- **Model**: `gpt-4o` (constant `BEST_IMAGE_SELECTION_MODEL` in `utils/constants.py:BEST_IMAGE_SELECTION_MODEL`)
- **Provider**: OpenAI via Portkey
- **System prompt** (`services/image/image.py:302-303`):
  ```
  You are an expert at matching images to search queries.
  Analyze the images and metadata carefully but keep the images more selection criteria to select only the most relevant ones. Return valid JSON format.
  ```
- **User prompt** (`prompts/image_description.py:94-122`):
  ```
  Please analyze these {len(top_hits)} images and their metadata to find the SINGLE BEST match for the search query: "{query}"

  For each image, I'll provide:
  - Image ID (for reference)
  - Context, Description, Product Name, CDN URL
  - The actual image

  Your task:
  1. Evaluate each image's relevance to the query "{query}"
  2. Consider both visual content and metadata
  3. Select ONLY the ONE best matching image
  4. If none are truly relevant, return null
  5. IMPORTANT: Use the EXACT CDN URL provided for the selected image

  Response format (JSON):
  {
      "best_image": "image_id" or null,
      "best_image_url": "EXACT cdn_url from the selected image" or null,
      "reasoning": "Brief explanation of why this image is the best match or why none match"
  }

  Images to evaluate: [then each image as text block + actual image via input_image]
  ```
- **Required inputs**: `hits: list[dict]` (Pinecone results with `fields.cdn_url`, `fields.context`, `fields.description`, `fields.product_name`), `query: str`, `p_id: str`
- **Response format**: `select_best_image_response_format` (`response_formats/image_description_gen.py`)
- **Output type**: `str | None` (CDN URL of selected image)

---

### Step 3: `generate_prompt` (image generation prompt expansion)
- **File**: `services/replicate/replicate.py:105`
- **Description**: Expands a short image description into a detailed photorealistic generation prompt. Two variants: normal generation (amp_up=False) and refinement (amp_up=True).
- **Model (primary)**: `claude-sonnet-4-6` (constant `PROMPT_GENERATION_MODEL`, `utils/constants.py`)
- **Model (fallback)**: `claude-sonnet-4-20250514` (constant `PROMPT_GENERATION_FALLBACK_MODEL`)
- **Provider**: Anthropic Claude via Portkey
- **System prompt — normal generation** (`prompts/image_gen.py:63-120`):
  ```
  You are an expert AI Prompt Engineer specializing in creating detailed, photorealistic prompts for commercial marketing imagery. Your function is to take a single, concise business need and translate it into a rich, descriptive prompt that a generative AI model (like Midjourney or DALL-E 3) can use to create a high-quality, high-conversion image.

  You will be given one input:
  1. description: A concise description of the desired scene, subject, and mood.

  Core Directives:
  1. Photorealism and Commercial Quality: photorealistic, professional commercial photography, high-detail, 4K resolution, sharp focus. Lighting: bright and welcoming natural light, soft studio lighting, or warm golden-hour sunlight. Color: vibrant, rich, and inviting. Composition: eye-level view, medium shot, close-up, bokeh background.
  2. The "Commercial Presence" Rule (Non-Negotiable): If people present — must look directly at camera, warm/confident/professional expression.
  3. Elaborate on the Core Concept: expand user's description into a full scene.

  Output Format:
  <final_prompt>[Your generated prompt here]</final_prompt>
  [Examples included in prompt — see prompts/image_gen.py:98-120]
  ```
- **System prompt — amp-up refinement** (`prompts/image_gen.py:1-61`):
  ```
  You are an expert AI Prompt Engineer creating instructions for generative image editing to transform images into high-quality landing page assets.

  The inputs provided will be a json {description: "[Instruction for Image Generation Prompt]"}
  Instruction for Image Generation Prompt will consist of:
  1. Existing image's description in <existing_image></existing_image> tags.
  2. Expected image description in <expected_image></expected_image> tags.

  YOUR TASK:
  Step 1: Identify Core Changes — compare existing and expected descriptions.
  Step 2: Preserve What's Already Correct — note elements already matching expected.
  Step 3: Apply Landing Page Standards — people looking at camera, bright natural lighting, vibrant colors, pristine professional environment.
  Step 4: Write the Transformation Prompt — single clear instruction focused only on the delta.

  Output Format:
  <final_prompt>[Your single transformation prompt here]</final_prompt>
  ```
- **User prompt** (`services/replicate/replicate.py:115-118`):
  ```
  { "description": "{description}" }
  ```
- **Required inputs**: `description: str`, `amp_up: bool`, `project_id: str`
- **Output type**: `str` (extracted from `<final_prompt>...</final_prompt>` tags)
- **max_tokens**: 64000
- **cache_system_prompt**: True (1-hour Anthropic prompt cache)

---

### Step 4: `generate` (Replicate image generation)
- **File**: `services/replicate/replicate.py:146`
- **Description**: Calls Replicate API to generate or edit an image. Polls until completion. Falls back to Google Gemini SDK if nano-banana-pro fails.
- **Primary model**: `google/nano-banana-pro` (via Replicate)
- **Fallback model**: `gemini-3-pro-image-preview` (constant `GEMINI_NANO_BANANA_PRO`, via Google `genai` SDK)
- **Provider**: Replicate HTTP API, or Google GenAI SDK fallback
- **Replicate endpoint**: `POST https://api.replicate.com/v1/models/{model_version}/predictions`
- **Allowed aspect ratios** (nano-banana-pro): `["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]`
- **Payload fields**:
  ```python
  {
    "model_version": "google/nano-banana-pro",  # required
    "prompt": str,                              # required
    "aspect_ratio": str,                        # required
    "image_input": [str],                       # optional — list of image URLs for img2img
  }
  ```
- **Retry**: `@backoff.on_exception(backoff.expo, Exception, max_tries=3)`
- **Polling interval**: 2 seconds
- **Output type**: `str` (image URL from Replicate output)

---

### Step 5: `refine_images` (service pages only)
- **File**: `services/image/image.py:482`
- **Description**: For service pages with existing matched images — first upscales the existing image, then uses it as img2img input with the amp-up prompt.
- **Upscale model**: `recraft-ai/recraft-crisp-upscale` (fallback: `google/upscaler`)
- **Then**: calls `generate_prompt(amp_up=True)` + `generate()` with `image_input=[upscaled_url]`
- **Input**: `images_for_amp_up: list[dict]` with keys `description`, `aspect_ratio`, `image_url`
- **Output**: updated list with `image_url` set to refined image CDN URL

---

### Step 6: `upscale_images` (category pages only)
- **File**: `services/image/image.py:529`
- **Description**: For category pages with existing matched images — just upscales, no re-generation.
- **Upscale model**: `recraft-ai/recraft-crisp-upscale` (fallback: `google/upscaler`)
- **Max wait**: 300 seconds, poll interval starts at 2s with ×1.5 backoff, capped at 10s

---

### Step 7: Blog cover image generation
- **File**: `handlers/create_blog_pages/image_operations/cover_image.py:27`
- **Description**: Generates blog cover images in 16:9 and 1:1 aspect ratios. The prompt is hardcoded (no LLM expansion step). Company logo passed as `image_input` to nano-banana-pro.
- **Model**: `google/nano-banana-pro` (via Replicate)
- **Prompt template** (`cover_image.py:28-48`):
  ```
  Create a professional blog cover image for a blog post about "{blog_topic}"

  DESIGN REQUIREMENTS:
  - Incorporate the company logo prominently but not dominantly (top-left or top-right corner, approximately 10-15% of image width)
  - Use a light coloured background that complements the brand's primary color. The primary colour should be incorporated in the design elements.
  - Apply secondary and accent colors for visual hierarchy and contrast.
  - The blog topic should be present in bold text.
  - Ensure the design reflects the blog topic through relevant iconography or imagery.
  - Include subtle geometric shapes, gradients, or relevant imagery that complement the brand colors.
  - Maintain high contrast for readability.
  - Style should align with B2B/professional audience expectations.

  MOOD & TONE:
  - Professional yet approachable
  - Industry-relevant imagery
  - Forward-thinking and modern
  - Trustworthy and authoritative

  The final image should be eye-catching enough for social media while maintaining professional standards suitable for B2B communications.
  ```
- **Variables**: `{blog_topic}` — the cluster topic string from Postgres
- **Note (OLD vs NEW)**: The `scripts/test_infographic_graphic_token.py` "new" variant appends a `BRAND IDENTITY` block with actual `graphic_token` values. This is NOT yet in production — it's a planned enhancement.

---

### Step 8: Blog external image generation
- **Sub-step 8a**: `generate_google_search_queries()`
  - **Prompt ID**: `PortKeyPromptIDs.GOOGLE_SEARCH_QUERIES` = `pp-google-sea-08e750` (dev) / `pp-google-sea-dc6494` (prod)
  - **Variable**: `{description}` — the image requirement description
  - **Output**: JSON with `queries` array (3 queries)
- **Sub-step 8b**: Serper image search — 3 queries × top 5 images
- **Sub-step 8c**: `get_image_descriptions_from_gpt_vision()`
  - **Model**: `gpt-4o`
  - **System prompt**: `"You are an expert image analyst. Provide detailed, accurate descriptions of images."`
  - **User prompt** (`prompts/image_description.py:77-90`):
    ```
    You are an expert visual and contextual interpreter. Given a JSON object containing an image URL, generate a detailed and accurate description of what the image represents.
    Instructions:
    - Analyze the image at the provided URL, including all visual elements, text, objects, people, background, colors, and contextual clues.
    - Infer the meaning, purpose, or context of the image based on both visual and textual cues.
    - The description should be detailed and informative, suitable for RAG systems.
    Output Format:
    { "image_url": "<Given image URL>", "description": "<Detailed inferred description>" }
    ```
- **Sub-step 8d**: `select_best_external_image()` — Claude Sonnet 4.5, selects best from described images
- **Sub-step 8e**: `generate_updation_prompt()` — PortKey prompt `pp-external-i-b2935e` (dev) / `pp-external-i-88e4d4` (prod), variables `{selected_image_description}`, `{target_image_requirement}`, output extracted from `<output_prompt>` tags
- **Sub-step 8f**: `nano-banana-pro` img2img with the selected image URL and updation prompt

---

### Step 9: Demo image generation
- **File**: `services/image/image.py:53`, prompt in `prompts/demoware/image_generation.py`
- **Model for prompt generation**: `claude-sonnet-4-20250514` (constant `DEMO_IMAGE_PROMPT_GENERATION_MODEL`)
- **System prompt** (`prompts/demoware/image_generation.py:5-32`):
  ```
  You are an expert AI Prompt Engineer specializing in creating detailed, photorealistic prompts for commercial marketing imagery...
  [identical to main image_generation_system_prompt but adds:]
  4. Strictly include strict directions to not include any logos anywhere in the images

  Output Format: <generation_prompt>[Your generated prompt here]</generation_prompt>
  ```
- **User prompt**: raw `image_description` string (no JSON wrapping)
- **Image model**: `prunaai/z-image-turbo` (via Replicate)
- **z-image-turbo payload**:
  ```python
  {
    "model_version": "prunaai/z-image-turbo",
    "prompt": str,
    "width": int,   # from Z_IMAGE_TURBO_ASPECT_RATIO_TO_SIZE map
    "height": int,
    "output_format": "webp",
    "output_quality": 80,
    "num_inference_steps": 8,
    "guidance_scale": 0,
  }
  ```
- **Allowed aspect ratios**: `["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "9:21"]`

---

## 5. External API Integrations

### 5.1 Portkey AI (LLM Gateway)

| Field | Value |
|---|---|
| Role | Unified LLM gateway for all Claude, GPT, Gemini, o-series calls |
| Env var | `PORTKEY_API_KEY` |
| Config ID | `pc-portke-0dd3de` (hardcoded in `services/portkey/completions.py:17` and `responses.py:27`) |
| Header | `X-Portkey-Config: pc-portke-0dd3de` |
| Endpoints | `https://api.portkey.ai/v1/chat/completions` (Claude, GPT) and `https://api.portkey.ai/v1/responses` (o-series reasoning models) and `https://api.portkey.ai/v1/prompt` (Portkey stored prompts) |
| Compliance header | `x-portkey-strict-open-ai-compliance: false` (required for Claude) |
| Timeout | 600 seconds (`aiohttp.ClientTimeout(total=600)`) |
| Metadata header | `X-Portkey-Metadata: {project_id, step_name, ...}` — sent with every request for observability |
| Prompt caching | `cache_control: {type: "ephemeral", ttl: "1h"}` on system prompts when `cache_system_prompt=True` |
| Stored prompts | `DevPortkeyPromptIDs` enum (dev) / `PortKeyPromptIDs` enum (prod) in `utils/constants.py` |

**Models routed through Portkey** (from `utils/constants.py`):

| Constant | Model ID | Use in image pipeline |
|---|---|---|
| `PROMPT_GENERATION_MODEL` | `claude-sonnet-4-6` | Image generation prompt expansion |
| `PROMPT_GENERATION_FALLBACK_MODEL` | `claude-sonnet-4-20250514` | Fallback for prompt expansion |
| `DEMO_IMAGE_PROMPT_GENERATION_MODEL` | `claude-sonnet-4-20250514` | Demo image prompt generation |
| `BEST_IMAGE_SELECTION_MODEL` | `gpt-4o` | Select best Pinecone hit |
| `CLAUDE_SONNET_4_5` | `claude-sonnet-4-5` | External image best-selection |
| `GPT_4O` | `gpt-4o` | External image vision descriptions |

---

### 5.2 Replicate

| Field | Value |
|---|---|
| Role | Primary image generation |
| Env var | `REPLICATE_API_TOKEN` |
| Endpoint (generation) | `POST https://api.replicate.com/v1/models/{model_version}/predictions` |
| Endpoint (poll) | `GET https://api.replicate.com/v1/predictions/{prediction_id}` |
| Auth header | `Authorization: Token {REPLICATE_API_TOKEN}` |
| Poll interval | 2 seconds, no timeout (relies on Lambda timeout) |
| Retry policy | `@backoff.on_exception(backoff.expo, Exception, max_tries=3)` |
| Primary model | `google/nano-banana-pro` |
| Upscale model | `recraft-ai/recraft-crisp-upscale` |
| Upscale fallback | `google/upscaler` |
| Demo model | `prunaai/z-image-turbo` |

---

### 5.3 Google Gemini SDK (Fallback)

| Field | Value |
|---|---|
| Role | Fallback for nano-banana-pro when Replicate fails |
| Env var | `GOOGLE_IMAGE_GEN_KEY` |
| SDK | `google-genai` |
| Client init | `genai.Client(api_key=os.getenv("GOOGLE_IMAGE_GEN_KEY"))` (`services/google/image_gen.py:17`) |
| Model constant | `GEMINI_NANO_BANANA_PRO = "gemini-3-pro-image-preview"` |
| Method | `client.models.generate_content(model, contents, config)` |
| Output | Returns raw image bytes; uploaded to S3 as temp PNG, URL passed back |
| Supported aspect ratios | `["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]` |
| Supported resolutions | `["1K", "2K", "4K"]` |

---

### 5.4 Pinecone

| Field | Value |
|---|---|
| Role | Vector DB for finding existing client images |
| Client | `services/pine_cone/pine_cone.py:PineconeClient` |
| Dense index host | `bifrost-images-index` (`utils/constants.py:PINECONE_DENSE_INDEX_HOST`) |
| Sparse index host | `bifrost-images-sparse-index` (`utils/constants.py:PINECONE_SPARSE_INDEX_HOST`) |
| Namespace | `staging_subdomain` (per-client isolation) |
| Search type | Hybrid (dense + sparse, reranked) |
| Top-K | 20 initial results, then GPT-4o selects best 1 from top 5 |
| Fields returned | `["*"]` — includes `cdn_url`, `description`, `context`, `product_name` |

---

### 5.5 Serper (Image Search — Blog External Images)

| Field | Value |
|---|---|
| Role | Google image search for external blog images |
| Client | `services/serper/serper.py:SerperService` |
| Used in | `handlers/create_blog_pages/image_operations/external_images.py:282` |
| Call | `serper.get_images(keyword=query, location="us", language="en")` |
| Results used | Top 5 per query, 3 queries → up to 15 image URLs |

---

### 5.6 AWS S3 + CDN

| Field | Value |
|---|---|
| Prod bucket | `gw-content-store` (env var `RESOURCE_ENVIRONMENT=prod`) |
| Dev bucket | `gw-content-store-dev` |
| Stormbreaker bucket | `gw-stormbreaker` (temp upload of unprocessed images) |
| Prod CDN base | `https://file-host.link` |
| Dev CDN base | `https://cdn-dev.gushwork.ai` |
| WebP variants uploaded | `360.webp`, `720.webp`, `1080.webp` per image |
| S3 paths |  |
| — Generated images | `website/{staging_subdomain}/assets/generated-images/` |
| — Refined images | `website/{staging_subdomain}/assets/refined-images/` |
| — Blog images | `website/{staging_subdomain}/assets/blog-images/{cluster_id}/` |

---

## 6. Old vs New Flow Findings

**There are no feature flags, A/B routes, or v1/v2 distinctions in production code.**

The "old vs new" concept exists **only in `scripts/`** as standalone comparison test scripts:

| Script | Old (Variant A) | New (Variant B) | Status |
|---|---|---|---|
| `scripts/test_infographic_graphic_token.py` | `create_cover_image_prompt_old(blog_topic)` — generic brand references | `create_cover_image_prompt_new(blog_topic, token_keys)` — actual `graphic_token` values injected as `BRAND IDENTITY` block | NOT in production |
| `scripts/test_custom_metal_infographic.py` | No brand context in description | Firecrawl-extracted brand colors injected into description | NOT in production |
| `scripts/test_brand_image.py` | Description without brand colors | Description + brand hex values injected | NOT in production |

**`graphic_token` schema** (from `test_infographic_graphic_token.py:81-91`):
```python
{
  "primary_color":   str,  # e.g. "#007DC5"
  "secondary_color": str,  # e.g. "#00B4D8"
  "accent_color":    str,
  "text_color":      str,
  "heading_font":    str,  # e.g. "Urbanist"
  "body_font":       str,
  "brand_style":     str,  # 1-sentence visual personality
  "tagline":         str,
  "logo_style":      str,
  "industry":        str,
}
```

**Implication for the playground**: The playground must implement the "old vs new" split itself. Old = current production behavior (no `graphic_token` injection). New = inject `graphic_token` values into the relevant prompt(s) at the point where the description is built or expanded.

**Which prompts are affected by graphic_token injection:**
1. **Cover image prompt** (`cover_image.py:create_cover_image_prompt`) — append `BRAND IDENTITY` block
2. **LLM prompt expansion** (`replicate.py:generate_prompt`) — inject into the `description` field before the LLM call
3. Potentially the **amp-up system prompt** (no `graphic_token` injection tested for this path yet)

---

## 7. Prompt Variable Catalog

All variables that get interpolated into prompts anywhere in the image pipeline:

| Variable | Type | Source step | Used in prompt |
|---|---|---|---|
| `description` | `str` | Cluster `page_info.images[*].description` (service/category) or `<image_requirement>` body (blog) | `generate_prompt()` user prompt: `{ "description": "{description}" }` |
| `amp_up` | `bool` | Determined by pipeline branch (service=True for refined, False for new) | Selects which system prompt: `amp_up_prompt_system_prompt` vs `image_generation_system_prompt` |
| `existing_image` | `str` (XML tag) | Vector DB match's description (`image_url_to_description_map`) | Amp-up user prompt inside `description` field: `<existing_image>{pc_description}</existing_image>` |
| `expected_image` | `str` (XML tag) | Original image description from page_info | Amp-up user prompt inside `description` field: `<expected_image>{description}</expected_image>` |
| `aspect_ratio` | `str` | Parsed from `context` field of image object (e.g. `"hero#16:9"`) | Passed to Replicate payload |
| `image_url` (img2img) | `str \| None` | From Pinecone hit's `cdn_url` (after upscaling for service pages) | Replicate payload `image_input` array |
| `company_logo` | `str \| None` | `project.logo_urls.primary_logo` from Postgres; `None` if default logo | Replicate payload `image_input` array (for cover/infographic) |
| `blog_topic` | `str` | `cluster.topic` from Postgres | `create_cover_image_prompt(blog_topic)` |
| `query` | `str` | Image description (blog internal) | Pinecone search + Replicate `prompt` field (raw, no expansion) |
| `top_hits` | `list[dict]` | Pinecone ranked results | `get_select_best_image_prompt(top_hits, query)` — image + text passed to GPT-4o |
| `selected_image_description` | `str` | GPT-4o vision output on best SERP image | `generate_updation_prompt()` variable `{selected_image_description}` |
| `target_image_requirement` | `str` | Image requirement description from blog placeholder | `generate_updation_prompt()` variable `{target_image_requirement}` |
| `master_query` | `str` | Image description (blog external) | `generate_google_search_queries()` variable `{description}` |
| `image_description` (demo) | `str` | From demo cluster | `get_demo_image_generation_prompt(image_description)` user prompt (raw string) |
| `graphic_token` | `dict` | **NOT currently in production** — planned input | Would inject into cover image prompt or generation description (see §6) |
| `project_id` | `str` | Lambda event | Portkey metadata (`X-Portkey-Metadata`) — not a prompt variable but required for all LLM calls |
| `staging_subdomain` | `str` | Postgres `project.staging_subdomain` | Pinecone namespace, S3 paths |

---

## 8. Open Questions / Gaps

1. **`graphic_token` source in production**: The `graphic_token` JSON object is used in test scripts but has no production path. Where does it come from — is it in the Postgres `projects` table already (perhaps as a design token field), or would the playground need to accept it as raw user input? **UNKNOWN — needs manual input.**

2. **Portkey stored prompt content**: Several steps use Portkey prompt IDs (`pp-google-sea-*`, `pp-external-i-*`, `pp-external-i-*`). The full prompt strings for those stored prompts are managed in the Portkey dashboard, not in the codebase. The playground will need to replicate them locally or call Portkey directly. **UNKNOWN — needs manual input (export from Portkey dashboard).**

3. **Pinecone namespace data availability**: The blog `InternalImageService` queries Pinecone with `namespace=staging_subdomain`. For the playground to test "internal" images, a populated namespace is required. **The playground may need to either connect to the real Pinecone index or mock this step.**

4. **`REPLICATE_API_TOKEN` hardcoded in test scripts**: The scripts in `scripts/` contain hardcoded Replicate tokens and Portkey API keys. These are NOT environment variables in the scripts. The playground should use env vars.

5. **Image post-processing Lambda**: `utils/utils.py:convert_images()` calls a separate Lambda (`gw-lambda-utils`) to convert images to WebP resolutions. This is an internal dependency. The playground may need to skip this step (raw URL output) or replicate the conversion locally.

6. **Blog placeholder format**: The `<image_requirement id="..." type="..." aspect_ratio="..." alt="...">` XML format is generated by an earlier LLM step (`create_image_placeholders.py`). For the playground to test blog image generation in isolation, the placeholder format needs to be hardcoded as test input.

7. **`ignoreRevamp` / `ignoreGeneration` flags in context**: These string flags in the image `context` field control which images skip refinement/generation. The playground UI should expose these as optional toggles.

8. **Demo pipeline vs production pipeline**: The demo pipeline uses `prunaai/z-image-turbo` + `get_demo_image_generation_prompt()` (outputs `<generation_prompt>` tag). The production pipeline uses `google/nano-banana-pro` + `image_generation_system_prompt` (outputs `<final_prompt>` tag). These are meaningfully different — the playground should expose both.

9. **Upscale before amp-up (service pages)**: The `refine_images` path upscales the existing image with `recraft-ai/recraft-crisp-upscale` before passing it to nano-banana-pro. Whether this upscale step should be part of the playground comparison is unclear. **UNKNOWN — needs decision.**

10. **WebP multi-resolution output**: The final image output is stored as `360.webp`, `720.webp`, `1080.webp` paths in S3. For the playground, a single raw URL may be sufficient — confirm whether resolution variants are needed in the UI.

---

*Document generated: 2026-04-17. Source: read-only exploration of `gw-backend-stormbreaker/`.*
*All file references are relative to `/Users/animeshjhawar/workspace/gw-backend-stormbreaker/`.*
