// ---------------------------------------------------------------------------
// Firecrawl provider — Step 1: scrape_client_site
// Reference: docs/backend-context.md §5 (External API Integrations)
// ---------------------------------------------------------------------------

export interface FirecrawlResult {
  clean_html: string;
  branding_json: object;
}

export async function scrapeClientSite(url: string): Promise<FirecrawlResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FIRECRAWL_API_KEY is not set. Local: add to .env.local and restart `npm run dev`. Vercel: add in Project Settings → Environment Variables, then redeploy."
    );
  }

  // Capped at 55s to fit inside Vercel Hobby's 60s function limit.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  let response: Response;
  try {
    response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["html", "markdown", "extract"],
        extract: {
          schema: {
            type: "object",
            properties: {
              primary_color:   { type: "string" },
              secondary_color: { type: "string" },
              accent_color:    { type: "string" },
              text_color:      { type: "string" },
              heading_font:    { type: "string" },
              body_font:       { type: "string" },
              logo_url:        { type: "string" },
              tagline:         { type: "string" },
              industry:        { type: "string" },
            },
          },
        },
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 402) {
    throw new Error("Firecrawl quota exceeded (402). Check your plan limits.");
  }
  if (response.status === 429) {
    throw new Error("Firecrawl rate limit hit (429). Wait a moment and retry.");
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Firecrawl error ${response.status}: ${body.slice(0, 200)}`);
  }

  const json = (await response.json()) as {
    success: boolean;
    data?: {
      html?: string;
      markdown?: string;
      extract?: Record<string, unknown>;
    };
    error?: string;
  };

  if (!json.success) {
    throw new Error(`Firecrawl returned success:false — ${json.error ?? "unknown reason"}`);
  }

  const data = json.data ?? {};
  // Prefer markdown for LLM processing (cleaner than raw HTML); fall back to html
  const clean_html = data.markdown ?? data.html ?? "";
  const branding_json = data.extract ?? {};

  return { clean_html, branding_json };
}
