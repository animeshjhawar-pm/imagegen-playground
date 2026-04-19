import { formatBrandLines } from "@/config/prompts-old-flow";

/**
 * Extends the resolved input map with derived variables used by system /
 * user prompt templates:
 *   • `brand_lines` — the "- Label: value" block rendered from a
 *     graphic_token JSON string. Matches the output of
 *     `scripts/test_infographic_graphic_token.py:create_cover_image_prompt_new`.
 *
 * Accepts inputs that may or may not include graphic_token; missing keys
 * simply don't contribute. Never throws on malformed JSON.
 */
export function prepareLLMVars(inputs: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = { ...inputs };

  const tokenRaw = inputs.graphic_token?.trim();
  if (tokenRaw) {
    try {
      const parsed = JSON.parse(tokenRaw);
      if (parsed && typeof parsed === "object") {
        vars.brand_lines = formatBrandLines(parsed as Record<string, unknown>);
      }
    } catch {
      // Leave brand_lines unset; the template will interpolate to "".
    }
  }

  return vars;
}
