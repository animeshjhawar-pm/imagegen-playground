// ---------------------------------------------------------------------------
// Replicate provider — Step 5: generate_image (google/nano-banana-pro)
// Reference: docs/backend-context.md §5.2
// ---------------------------------------------------------------------------

export interface ReplicateResult {
  image_url: string;
}

const MAX_WAIT_MS   = 120_000; // 2 minutes
const POLL_INTERVAL = 2_000;   // 2 seconds between polls
const MAX_RETRIES   = 3;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateImage(params: {
  prompt: string;
  aspectRatio: string;
  imageInput?: string[];
}): Promise<ReplicateResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN is not set. Add it to .env.local and restart the dev server."
    );
  }

  const { prompt, aspectRatio, imageInput } = params;

  const input: Record<string, unknown> = { prompt, aspect_ratio: aspectRatio };
  // Only include image_input if non-empty (empty array behaves differently)
  if (imageInput && imageInput.length > 0) {
    input.image_input = imageInput;
  }

  // POST prediction with retry on transient failures
  let predictionId: string | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(
        "https://api.replicate.com/v1/models/google/nano-banana-pro/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        }
      );

      if (resp.status === 401) {
        throw new Error("Replicate auth error (401). Check REPLICATE_API_TOKEN.");
      }
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        throw new Error(`Replicate create prediction ${resp.status}: ${body.slice(0, 300)}`);
      }

      const json = (await resp.json()) as { id?: string; error?: string };
      if (json.error) throw new Error(`Replicate error: ${json.error}`);
      if (!json.id)   throw new Error("Replicate returned no prediction ID");
      predictionId = json.id;
      break;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      await sleep(Math.pow(2, attempt - 1) * 1000); // exponential backoff: 1s, 2s, 4s
    }
  }

  if (!predictionId) throw new Error("Failed to create Replicate prediction");

  // Poll until succeeded or failed
  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL);

    const pollResp = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      { headers: { Authorization: `Token ${token}` } }
    );

    if (!pollResp.ok) {
      const body = await pollResp.text().catch(() => "");
      throw new Error(`Replicate poll error ${pollResp.status}: ${body.slice(0, 200)}`);
    }

    const status = (await pollResp.json()) as {
      status: string;
      output?: string | string[];
      error?: string;
    };

    if (status.status === "succeeded") {
      const raw = status.output;
      const image_url = Array.isArray(raw) ? raw[0] : (raw ?? "");
      if (!image_url) throw new Error("Replicate succeeded but output was empty");
      return { image_url };
    }

    if (status.status === "failed" || status.status === "canceled") {
      throw new Error(
        `Replicate prediction ${status.status}: ${status.error ?? "no error message"}`
      );
    }
    // status === 'starting' | 'processing' → keep polling
  }

  throw new Error(`Replicate prediction timed out after ${MAX_WAIT_MS / 1000}s`);
}
