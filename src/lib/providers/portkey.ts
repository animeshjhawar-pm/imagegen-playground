// ---------------------------------------------------------------------------
// Portkey provider — Steps 2–4: LLM calls via Portkey gateway
// Reference: docs/backend-context.md §5.1
// ---------------------------------------------------------------------------

export interface PortkeyResult {
  text: string;
  rawResponse: object;
}

export interface PortkeyMetadata {
  project_id?: string;
  step_name: string;
  flow_type: "old" | "new";
  client_id: string;
}

export async function callPortkey(params: {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  metadata: PortkeyMetadata;
}): Promise<PortkeyResult> {
  const apiKey    = process.env.PORTKEY_API_KEY;
  const configId  = process.env.PORTKEY_CONFIG_ID ?? "pc-portke-0dd3de";

  if (!apiKey) {
    throw new Error(
      "PORTKEY_API_KEY is not set. Local: add to .env.local and restart `npm run dev`. Vercel: add in Project Settings → Environment Variables, then redeploy."
    );
  }

  const { model, systemPrompt, userPrompt, maxTokens = 4096, metadata } = params;

  // Capped at 55s to fit inside Vercel Hobby's 60s function limit.
  // Claude Sonnet at ~4K tokens typically completes in <30s.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  let response: Response;
  try {
    response = await fetch("https://api.portkey.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization":                    `Bearer ${apiKey}`,
        "X-Portkey-Config":                 configId,
        "x-portkey-strict-open-ai-compliance": "false",
        "X-Portkey-Metadata":               JSON.stringify(metadata),
        "Content-Type":                     "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      `Portkey auth error (${response.status}). Check PORTKEY_API_KEY and PORTKEY_CONFIG_ID.`
    );
  }
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Portkey error ${response.status}: ${body.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (json.error) {
    throw new Error(`Portkey LLM error: ${json.error.message ?? JSON.stringify(json.error)}`);
  }

  const text = json.choices?.[0]?.message?.content ?? "";
  return { text, rawResponse: json };
}
