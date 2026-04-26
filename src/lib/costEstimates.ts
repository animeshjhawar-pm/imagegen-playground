// ---------------------------------------------------------------------------
// Rough per-step cost estimates (order-of-magnitude, not exact billing).
// Used for the Run All confirmation modal and session cost display.
// ---------------------------------------------------------------------------

export const COST_PER_STEP_USD: Record<string, number> = {
  scrape_client_site:                0.002,   // Firecrawl per-page
  extract_graphic_token:             0.010,   // Claude Sonnet ~4K tokens in, 1K out
  generate_placeholder_description:  0.008,   // Claude Sonnet small call
  build_image_prompt:                0.008,   // Claude Sonnet ~4K in, 1K out
  generate_image:                    0.050,   // Replicate nano-banana-pro
  generate_cover_image:              0.050,   // merged blog:cover_thumbnail — 16:9 cover render
  generate_thumbnail_image:          0.050,   // merged blog:cover_thumbnail — 3:2 thumbnail render
};

export function estimateCost(stepName: string): number {
  return COST_PER_STEP_USD[stepName] ?? 0;
}

export function formatCost(usd: number): string {
  if (usd < 0.01) return `~$${usd.toFixed(4)}`;
  return `~$${usd.toFixed(2)}`;
}
