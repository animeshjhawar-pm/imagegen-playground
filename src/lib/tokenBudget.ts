// ---------------------------------------------------------------------------
// Token budgeting for LLM inputs.
//
// Claude's tokenizer averages ~4 chars/token for English prose and markdown
// (empirically checked against Anthropic's tokenizer on a handful of scraped
// pages — close enough for a safety cap). We deliberately don't ship a
// proper tokenizer here (added weight, async init) since the cap is a guard
// rail, not a billing-critical number.
// ---------------------------------------------------------------------------

export const CHARS_PER_TOKEN = 4;

/** Cheap character-based token estimate. Conservative (tends to overcount). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export interface TruncationResult {
  text: string;
  /** `null` when the input fit within the budget. */
  warning: string | null;
}

/** Cap `text` at `maxTokens` × 4 chars. Returns the (possibly truncated)
 *  text plus a human-readable warning string when truncation happened. */
export function truncateToTokenBudget(
  text: string,
  maxTokens: number,
  label = "Input"
): TruncationResult {
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  if (text.length <= maxChars) return { text, warning: null };

  const truncated = text.slice(0, maxChars);
  const warning =
    `${label} truncated from ${formatCount(text.length)} chars ` +
    `to ${formatCount(maxChars)} to fit ${formatCount(maxTokens)}-token limit.`;
  return { text: truncated, warning };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}
