# imagegen-playground

> **Internal tool — v0.1.** Not a production-grade product. A side-by-side debugging UI for the `gw-backend-stormbreaker` image generation pipeline.

Select a page type (service / category / blog) and image type, add multiple client configurations side-by-side, and run each pipeline step individually or all at once — making it easy to compare outputs across clients and between the old (no graphic token) and new (graphic token injected) prompt flows.

## Running locally

```bash
cp .env.local.example .env.local
# Fill in real API keys — see .env.local.example for all required variables

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Test Run mode is ON by default** — the app returns mocked responses so first-time users can click around with zero API cost. Flip the "Test Run" toggle in the header to OFF to fire real calls to Firecrawl, Portkey, and Replicate. A confirmation modal will show the step count and rough cost estimate before anything fires.

### Required API keys

| Key | Used for |
|---|---|
| `FIRECRAWL_API_KEY` | Step 1 — scrape client homepage |
| `PORTKEY_API_KEY` | Steps 2–4 — Claude LLM calls via Portkey gateway |
| `PORTKEY_CONFIG_ID` | Portkey routing config (default: `pc-portke-0dd3de`) |
| `REPLICATE_API_TOKEN` | Step 5 — `google/nano-banana-pro` image generation |

## Deploying to Vercel

This repo is tuned to run on **Vercel Hobby (free)**: [`vercel.json`](vercel.json) sets the `/api/run-step` function timeout to the Hobby-tier maximum of **60 seconds**. All three provider calls (Firecrawl, Portkey, Replicate) have matching client-side timeouts so a single step never exceeds that budget.

### Known Hobby-tier tradeoff

The Replicate image generation step (`google/nano-banana-pro`) occasionally takes 45–60 seconds end-to-end. On Hobby, the function is hard-killed at 60s, so a slow generation can time out. If that happens, click **▶ Run Step** on the `generate_image` cell again — inputs are preserved and the previous steps won't re-run. Upgrade to Vercel Pro later if you need longer timeouts (change `maxDuration` in `vercel.json` to up to `300`).

### Step-by-step

1. Push the repo to GitHub / GitLab / Bitbucket.
2. Go to <https://vercel.com/new> and import the repo. Vercel auto-detects the **Next.js** preset.
3. Under **Settings → Environment Variables**, add:
   - `FIRECRAWL_API_KEY`
   - `PORTKEY_API_KEY`
   - `PORTKEY_CONFIG_ID` (default: `pc-portke-0dd3de`)
   - `REPLICATE_API_TOKEN`
4. Click **Deploy** (no plan upgrade required).
5. After the first deploy succeeds, open the deployed URL, flip **Test Run** OFF, and run one real step end-to-end to verify all four keys are wired.

## Iterating on prompts

The playground is split into two lanes:

- **Old flow** — frozen baseline. Mirrors stormbreaker production byte-for-byte. View only, in the UI and in code. Changes here invalidate past comparisons.
- **New flow** — the experimentation surface. Edit freely.

Two files, one per lane:

| File | Purpose |
|---|---|
| [`src/config/prompts-old-flow.ts`](src/config/prompts-old-flow.ts) | **Frozen.** Stormbreaker verbatim — `image_generation_system_prompt`, `amp_up_prompt_system_prompt`, user templates, brand-block helpers. |
| [`src/config/prompts-new-flow.ts`](src/config/prompts-new-flow.ts) | **Edit here.** Step 2 graphic-token extraction, Step 3 placeholder description, Step 4 brand-identity injection. |

### Workflow

1. Open `prompts-new-flow.ts`, find the constant for the step you're iterating on (each has a comment listing the available `{{tokens}}`), edit, save.
2. Next.js hot-reloads. Click **▶ Run Step** on the new-flow side of a client.
3. Compare against the old-flow output sitting alongside.

For one-off experiments without editing code: click **View / Edit Prompt** on a new-flow step → edit the prompt inline → **▶ Save & Re-run**. Those overrides are per-client and per-session (they disappear on page refresh). Code edits in `prompts-new-flow.ts` are the permanent new baseline.

On an old-flow step the same button shows up as **View Prompt** and opens a read-only dialog — a deliberate guardrail so the baseline can't drift without a code change.

## Reference

- Pipeline details, prompt catalog, and API integration notes: [`docs/backend-context.md`](docs/backend-context.md)
- Environment variables: [`.env.local.example`](.env.local.example)
