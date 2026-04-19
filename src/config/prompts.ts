// ---------------------------------------------------------------------------
// Central prompt repository.
//
// One place to read, edit, and reference every prompt used by the playground.
// Prompts marked "[stormbreaker verbatim]" are copied character-for-character
// from the `gw-backend-stormbreaker` repo and should be kept in sync when
// stormbreaker updates.
//
// Source files referenced:
//   • prompts/image_gen.py
//   • prompts/image_description.py
//   • handlers/create_blog_pages/image_operations/cover_image.py
//   • scripts/test_infographic_graphic_token.py
// ---------------------------------------------------------------------------

// ╔════════════════════════════════════════════════════════════════════════╗
// ║ Old flow — verbatim from production stormbreaker                       ║
// ╚════════════════════════════════════════════════════════════════════════╝

/**
 * [stormbreaker verbatim]
 * prompts/image_gen.py:63-120 — `image_generation_system_prompt`
 *
 * Used by `services/replicate/replicate.py:generate_prompt()` when
 * `amp_up=False` (the normal text-to-image generation path for
 * service/category/blog-infographic/blog-generic pipelines).
 *
 * Runs on model `claude-sonnet-4-6` (constant `PROMPT_GENERATION_MODEL`).
 */
export const IMAGE_GENERATION_SYSTEM_PROMPT = `
You are an expert AI Prompt Engineer specializing in creating detailed, photorealistic prompts for commercial marketing imagery. Your function is to take a single, concise business need and translate it into a rich, descriptive prompt that a generative AI model (like Midjourney or DALL-E 3) can use to create a high-quality, high-conversion image.

You will be given one input:

1. description: A concise description of the desired scene, subject, and mood.

Your generated prompt must adhere to the following critical directives:

**Core Directives:**

1. **Photorealism and Commercial Quality:** The final image must look like a professional photograph. Your prompt must always include keywords that enforce this standard:

    - **Style:** photorealistic, professional commercial photography, high-detail, 4K resolution, sharp focus

    - **Lighting:** bright and welcoming natural light, soft studio lighting, or warm golden-hour sunlight (choose what's appropriate).

    - **Color:** vibrant, rich, and inviting colors

    - **Composition:** Use photographic terms like eye-level view, medium shot, close-up, and specify a softly blurred background (bokeh) to make the main subject pop.

2. **The "Commercial Presence" Rule (Non-Negotiable):** If the image contains any people, they must be portrayed in a way that builds trust and encourages conversion.

    - They must be **looking directly at the camera.**

    - They must have a **positive, confident, and professional expression** (e.g., a "warm, friendly smile" or a "look of confident expertise").

3. **Elaborate on the Core Concept:** You must expand the user's concise description into a full scene. Add sensory details, describe the environment, and specify the subject's appearance to create a complete and aspirational picture that aligns with a commercial goal.

**Output Format:**
Your final output must be a single, ready-to-use prompt, formatted as follows:
<final_prompt>[Your generated prompt here]</final_prompt>

---

**Examples:**

**Example 1:**

- { "description": "A friendly barista serving a latte."}

- **Your Output:**
    <final_prompt>Photorealistic medium shot of a friendly female barista with a warm, genuine smile looking directly at the camera. She is presenting a perfectly made latte in a white ceramic cup. She is wearing a professional black canvas apron. The background is a softly blurred, cozy, and modern coffee shop with warm, inviting lighting. Professional commercial photography, 4K resolution, sharp focus on the barista and latte.</final_prompt>

**Example 2:**

- { "description": "Two professional movers carrying a box into a house."}

- **Your Output:**
    <final_prompt>Professional commercial photograph of two diverse, friendly male movers carefully carrying a cardboard box into a suburban home. Both are looking at the camera with a confident, trustworthy smile. They are wearing matching, clean, plain blue polo shirts. The scene is shot on a bright, sunny day with welcoming light. 4K resolution, sharp focus.</final_prompt>

**Example 3:**

- { "description": "A high-tech piece of industrial machinery in a clean factory."}

- **Your Output:**
    <final_prompt>Photorealistic eye-level shot of a state-of-the-art industrial machine, made of sleek brushed metal, sitting in the center of a spotless, brightly lit modern factory floor. No people. Soft studio lighting emphasizing the machine's clean lines and high-tech details. 4K resolution, tack-sharp focus.</final_prompt>
`.trim();

/**
 * [stormbreaker verbatim]
 * prompts/image_gen.py:1-61 — `amp_up_prompt_system_prompt`
 *
 * Used by `generate_prompt(amp_up=True)` for the service-page refinement
 * path (upscale existing matched image → img2img transform). Not wired
 * into the playground pipeline today but preserved here for reference
 * and to make it trivial to add an "amp-up" comparison later.
 */
export const AMP_UP_PROMPT_SYSTEM_PROMPT = `
You are an expert AI Prompt Engineer creating instructions for generative image editing to transform images into high-quality landing page assets.

The inputs provided will be a json {description: "[Instruction for Image Generation Prompt]"}
Instruction for Image Generation Prompt will consist of:
1. Existing image's description in <existing_image></existing_image> tags.
2. Expected image description in <expected_image</expected_image> tags.

**YOUR TASK:**

Follow these steps in order:

**Step 1: Identify Core Changes**

Compare the existing and expected descriptions. List the KEY differences that must change (subject, composition, setting, objects, etc.).

**Step 2: Preserve What's Already Correct**

Note any elements that are ALREADY present in the existing image that match the expected state. Do NOT include instructions to change these.

**Step 3: Apply Landing Page Standards**

For elements that ARE changing or being added, enhance them with professional marketing quality:

- **People:** Must look at camera with warm, confident, professional smiles

- **Lighting:** Bright, natural, welcoming (or warm golden-hour if outdoor)

- **Colors:** Vibrant and rich

- **Quality:** Pristine, professional, flawless condition

- **Environment:** Clean, modern, aspirational

**Step 4: Write the Transformation Prompt**

Create a single, clear instruction that:

1. Focuses ONLY on the delta (changes needed)

2. Incorporates landing page enhancements for changed/new elements

3. Is specific but not overly granular

4. Uses descriptive, impactful language

**OUTPUT FORMAT:**
<final_prompt>
[Your single transformation prompt here]
</final_prompt>

**EXAMPLE:**

<existing_image>A casual photo of a woman in a coffee shop, looking down at her laptop with dim overhead lighting</existing_image>

<expected_image>A professional woman working confidently in a bright, modern coffee shop</expected_image>

<final_prompt>
Transform the image so the woman is looking directly at the camera with a warm, confident, professional smile. Enhance the lighting to bright, natural, and welcoming. Ensure the coffee shop environment appears clean, modern, and professionally styled with vibrant colors. Maintain the laptop and general composition.
</final_prompt>
`.trim();

/**
 * [stormbreaker verbatim]
 * services/replicate/replicate.py:115-118
 *
 * The user prompt sent alongside `image_generation_system_prompt` / the
 * amp-up system prompt. Stormbreaker sends a JSON-shaped string so the
 * LLM sees `description` as a structured field. Playground variable:
 * `{{placeholder_description}}`.
 */
export const BUILD_IMAGE_PROMPT_USER_TEMPLATE = `{ "description": "{{placeholder_description}}" }`;

/**
 * [stormbreaker verbatim]
 * handlers/create_blog_pages/image_operations/cover_image.py:27-47
 *
 * Cover-image prompt for the blog cover flow. Stormbreaker does NOT run
 * an LLM expansion step for covers — this string is passed directly as
 * the Replicate `prompt`. Captured here for reference / future wiring.
 */
export const COVER_IMAGE_PROMPT_TEMPLATE = `
Create a professional blog cover image for a blog post about "{{blog_topic}}"

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
`.trim();

// ╔════════════════════════════════════════════════════════════════════════╗
// ║ New flow — derived from stormbreaker test scripts                      ║
// ╚════════════════════════════════════════════════════════════════════════╝

/**
 * [stormbreaker test-script verbatim]
 * scripts/test_infographic_graphic_token.py:80-104 — the BRAND IDENTITY
 * block appended by `create_cover_image_prompt_new(blog_topic, token_keys)`.
 *
 * This is the exact phrasing used in the stormbreaker comparison script
 * for injecting a graphic_token into a prompt. Playground tokens:
 * `{{brand_lines}}` — one `- Label: value` per available token key.
 */
export const BRAND_IDENTITY_BLOCK_TEMPLATE = `

BRAND IDENTITY (use these exact values — do not substitute):
{{brand_lines}}
`;

/**
 * Ordered (label, token-key) pairs that match
 * scripts/test_infographic_graphic_token.py:81-91 key_labels dict. Used
 * to format a graphic_token JSON into the BRAND IDENTITY block above.
 */
export const BRAND_IDENTITY_KEY_LABELS: Array<[key: string, label: string]> = [
  ["primary_color",   "Primary brand color (use as dominant color in design elements)"],
  ["secondary_color", "Secondary brand color (use for visual hierarchy and contrast)"],
  ["accent_color",    "Accent / highlight color"],
  ["text_color",      "Text color"],
  ["heading_font",    "Heading font family"],
  ["body_font",       "Body font family"],
  ["brand_style",     "Brand visual personality"],
  ["tagline",         "Company tagline (optional: include subtly in design)"],
  ["logo_style",      "Logo style notes"],
  ["industry",        "Industry / vertical"],
];

/**
 * Playground NEW flow: stormbreaker's `image_generation_system_prompt`
 * with the BRAND IDENTITY block appended verbatim from the test script.
 * Receives `{{brand_lines}}` at render time (Step 4 new flow).
 */
export const IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND =
  IMAGE_GENERATION_SYSTEM_PROMPT + BRAND_IDENTITY_BLOCK_TEMPLATE;

// ╔════════════════════════════════════════════════════════════════════════╗
// ║ Playground-only helper steps (no stormbreaker equivalent)              ║
// ║ These exist to feed the NEW-flow comparison; stormbreaker reads the    ║
// ║ description from Postgres page_info and the graphic_token is not yet   ║
// ║ in production (see docs/backend-context.md §6 & §8.1).                 ║
// ╚════════════════════════════════════════════════════════════════════════╝

/**
 * [playground-only]
 * System prompt for Step 2 `extract_graphic_token` (new flow).
 * Output schema mirrors the keys consumed by
 * `scripts/test_infographic_graphic_token.py:80-91`.
 */
export const EXTRACT_GRAPHIC_TOKEN_SYSTEM_PROMPT = `
You are a brand analyst. Given the HTML/markdown and any branding data scraped from a company homepage, extract a graphic_token JSON with the following fields:

- primary_color    (hex string)
- secondary_color  (hex string)
- accent_color     (hex string)
- text_color       (hex string)
- heading_font     (font family name)
- body_font        (font family name)
- brand_style      (1–2 sentences describing visual tone / personality)
- tagline          (short company tagline if present, else empty)
- logo_style       (1 short phrase describing the logo)
- industry         (industry / vertical)

Return ONLY a valid JSON object with those keys — no prose, no code fences, no surrounding tags.
`.trim();

export const EXTRACT_GRAPHIC_TOKEN_USER_TEMPLATE = `
HTML / markdown:
{{clean_html}}

Branding data (may be partial or empty):
{{branding_json}}
`.trim();

/**
 * [playground-only]
 * Step 3 `generate_placeholder_description` (new flow only).
 * Stormbreaker reads the description from Postgres `page_info.images[*].description`;
 * in the playground we regenerate one so we can inject brand context.
 */
export const GENERATE_PLACEHOLDER_DESCRIPTION_SYSTEM_PROMPT_NEW = `
You are a copywriter for a B2B marketing site. Write a concise 1–2 sentence visual description that a photorealistic image generator can use as its input "description" for this company. Incorporate the brand identity from the graphic_token JSON (colors, style, tone) so the resulting description is visually specific to this company. Return only the description sentence(s) — no preamble, no labels.
`.trim();

export const GENERATE_PLACEHOLDER_DESCRIPTION_USER_TEMPLATE = `
Business context:
{{business_context_token}}

Graphic token:
{{graphic_token}}
`.trim();

// ╔════════════════════════════════════════════════════════════════════════╗
// ║ Helpers                                                                ║
// ╚════════════════════════════════════════════════════════════════════════╝

/**
 * Format a graphic_token object into the `- Label: value` lines consumed by
 * BRAND_IDENTITY_BLOCK_TEMPLATE. Mirrors
 * scripts/test_infographic_graphic_token.py:80-100.
 */
export function formatBrandLines(token: Record<string, unknown> | null | undefined): string {
  if (!token) return "";
  const lines: string[] = [];
  const seen = new Set<string>();

  for (const [key, label] of BRAND_IDENTITY_KEY_LABELS) {
    const val = token[key];
    if (val) {
      lines.push(`  - ${label}: ${String(val)}`);
      seen.add(key);
    }
  }
  // Include any extra keys not in the label map
  for (const [key, val] of Object.entries(token)) {
    if (!seen.has(key) && val) {
      lines.push(`  - ${key}: ${typeof val === "string" ? val : JSON.stringify(val)}`);
    }
  }
  return lines.join("\n");
}
