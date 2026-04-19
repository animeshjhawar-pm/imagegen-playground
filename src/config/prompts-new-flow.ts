// ═══════════════════════════════════════════════════════════════════════════
// NEW-FLOW PROMPT REPOSITORY — THE EXPERIMENTATION FILE.
//
// Edit these freely. Every time you hit "Run Step" (or Run All) on the NEW
// side of a client, these are the prompts that get sent. The OLD flow
// keeps using the frozen stormbreaker baseline in `prompts-old-flow.ts`
// so you always have an apples-to-apples comparison.
//
// Workflow for iterating:
//   1. Open this file
//   2. Edit the relevant constant (each has a header comment telling you
//      which step / model consumes it)
//   3. Save — Next.js hot-reloads, and your next "Run Step" on the new
//      side uses the updated prompt
//   4. Compare against the old-flow output that's already on screen
//
// For one-off experiments without editing code: click "View Prompt Used"
// on a new-flow step — the dialog lets you edit the prompt inline, save,
// and re-run. Overrides are per-client and stay until you Reset or
// refresh the page. Code edits in this file are the permanent new
// baseline; dialog edits are throwaway.
//
// Tokens you can use in templates:
//   {{clean_html}}             — from Step 1's output.clean_html
//   {{branding_json}}          — from Step 1's output.branding_json
//   {{business_context_token}} — from client context
//   {{graphic_token}}          — from Step 2's output (raw JSON string)
//   {{brand_lines}}            — derived from graphic_token, rendered as
//                                "  - Label: value" lines matching the
//                                BRAND IDENTITY block style from
//                                scripts/test_infographic_graphic_token.py
//   {{placeholder_description}} — from Step 3's output
// ═══════════════════════════════════════════════════════════════════════════

import {
  IMAGE_GENERATION_SYSTEM_PROMPT,
  BRAND_IDENTITY_KEY_LABELS,
} from "./prompts-old-flow";

// ───────────────────────────────────────────────────────────────────────────
// Step 2 — extract_graphic_token  (Portkey → Claude Sonnet 4.5)
// Inputs available:  {{clean_html}}, {{branding_json}}
// Output expected:   a JSON object consumed by later steps; keys are
//                    typically the ones listed in BRAND_IDENTITY_KEY_LABELS
// ───────────────────────────────────────────────────────────────────────────

/**
 * ★ PASTE YOUR NEW GRAPHIC_TOKEN PROMPT HERE ★
 *
 * This is the system prompt the Step 2 LLM call uses. Free-form editing —
 * the LLM output just needs to parse as JSON for downstream steps to pick
 * out fields like primary_color, heading_font, etc. If you change which
 * keys you emit, update BRAND_IDENTITY_KEY_LABELS in prompts-old-flow.ts
 * so the new-flow Step 4 BRAND IDENTITY block still renders them.
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

// ───────────────────────────────────────────────────────────────────────────
// Step 3 — generate_placeholder_description  (Portkey → Claude Sonnet 4.5)
// Inputs available:  {{business_context_token}}, {{graphic_token}},
//                    {{brand_lines}}
// Output expected:   a 1–2 sentence image description string (no preamble)
// ───────────────────────────────────────────────────────────────────────────

export const GENERATE_PLACEHOLDER_DESCRIPTION_SYSTEM_PROMPT = `
You are a copywriter for a B2B marketing site. Write a concise 1–2 sentence visual description that a photorealistic image generator can use as its input "description" for this company. Incorporate the brand identity from the graphic_token JSON (colors, style, tone) so the resulting description is visually specific to this company. Return only the description sentence(s) — no preamble, no labels.
`.trim();

export const GENERATE_PLACEHOLDER_DESCRIPTION_USER_TEMPLATE = `
Business context:
{{business_context_token}}

Graphic token:
{{graphic_token}}
`.trim();

// ───────────────────────────────────────────────────────────────────────────
// Step 4 — build_image_prompt  (Portkey → Claude Sonnet 4.6)
// Inputs available:  {{placeholder_description}}, {{graphic_token}},
//                    {{brand_lines}}
// User template:     the same JSON-wrapped description the old flow uses
//                    (lives in prompts-old-flow.ts — both flows share it).
// ───────────────────────────────────────────────────────────────────────────

/**
 * System prompt for the NEW-flow Step 4.
 *
 * Default = the old-flow system prompt + a BRAND IDENTITY block built
 * from the graphic_token (mirrors scripts/test_infographic_graphic_token.py's
 * `create_cover_image_prompt_new`). If you want to iterate on the brand
 * injection — change the wording of the block header, reorder keys, move
 * the block above the examples, etc. — do it here.
 */
export const IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND =
  IMAGE_GENERATION_SYSTEM_PROMPT +
  `

BRAND IDENTITY (use these exact values — do not substitute):
{{brand_lines}}
`;

// Keep an explicit re-export in case a future experiment swaps to a
// totally different key-label set per combination; today it matches the
// shared one in prompts-old-flow.ts.
export { BRAND_IDENTITY_KEY_LABELS };
