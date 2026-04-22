// ---------------------------------------------------------------------------
// Replicate provider — Step 5: generate_image
//
// Supports three models (selected per-step via stepConfig.model):
//   • google/nano-banana-pro   — default ($0.15 / img @ 2K)
//   • google/nano-banana-2     — adds image_search / google_search toggles
//   • bytedance/seedream-4     — enhance_prompt on, max_images=1
//
// All three use the same /predictions endpoint + poll flow; only the input
// shape and endpoint path differ.
// ---------------------------------------------------------------------------

export type ImageModel =
  | "google/nano-banana-pro"
  | "google/nano-banana-2"
  | "bytedance/seedream-4"
  | "openai/gpt-image-2";

export const DEFAULT_IMAGE_MODEL: ImageModel = "google/nano-banana-pro";

export interface ReplicateResult {
  image_url: string;
}

export interface GenerateImageParams {
  prompt: string;
  aspectRatio: string;
  imageInput?: string[];
  model?: ImageModel;
  /** nano-banana-2 only. */
  imageSearch?: boolean;
  /** nano-banana-2 only. */
  googleSearch?: boolean;
}

// Tuned for Vercel Hobby's 60s function timeout. Leaves ~5s headroom for
// the initial POST + retry sleep + response serialization.
const MAX_WAIT_MS   = 50_000; // 50s polling budget
const POLL_INTERVAL = 2_000;  // 2 seconds between polls
// Matches stormbreaker's services/replicate/replicate.py:
// @backoff.on_exception(backoff.expo, Exception, max_tries=3)
const MAX_RETRIES   = 3;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function buildModelInput(
  model: ImageModel,
  p: GenerateImageParams
): Record<string, unknown> {
  const { prompt, aspectRatio, imageInput } = p;

  if (model === "google/nano-banana-pro") {
    const input: Record<string, unknown> = { prompt, aspect_ratio: aspectRatio };
    // Only include image_input if non-empty (empty array behaves differently).
    if (imageInput && imageInput.length > 0) input.image_input = imageInput;
    return input;
  }

  if (model === "google/nano-banana-2") {
    return {
      prompt,
      aspect_ratio: aspectRatio,
      resolution: "2K",
      image_input: imageInput ?? [],
      image_search: p.imageSearch ?? false,
      google_search: p.googleSearch ?? false,
      output_format: "jpg",
    };
  }

  if (model === "bytedance/seedream-4") {
    return {
      prompt,
      aspect_ratio: aspectRatio,
      size: "2K",
      width: 2048,
      height: 2048,
      max_images: 1,
      image_input: imageInput ?? [],
      enhance_prompt: true,
      sequential_image_generation: "disabled",
    };
  }

  if (model === "openai/gpt-image-2") {
    // gpt-image-2 wraps each image in `{ value: url }` (different from the
    // other models) and lives on `input_images`, not `image_input`.
    const input_images = (imageInput ?? []).map((url) => ({ value: url }));
    return {
      prompt,
      quality: "high",
      background: "auto",
      moderation: "auto",
      aspect_ratio: aspectRatio,
      input_images,
      output_format: "webp",
      number_of_images: 1,
      output_compression: 90,
    };
  }

  throw new Error(`Unknown image model: ${model}`);
}

export async function generateImage(params: GenerateImageParams): Promise<ReplicateResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN is not set. Local: add to .env.local and restart `npm run dev`. Vercel: add in Project Settings → Environment Variables, then redeploy."
    );
  }

  const model = params.model ?? DEFAULT_IMAGE_MODEL;
  const input = buildModelInput(model, params);
  const endpoint = `https://api.replicate.com/v1/models/${model}/predictions`;

  // POST prediction with retry on transient failures
  let predictionId: string | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (resp.status === 401) {
        throw new Error("Replicate auth error (401). Check REPLICATE_API_TOKEN.");
      }
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        throw new Error(
          `Replicate create prediction (${model}) ${resp.status}: ${body.slice(0, 300)}`
        );
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
