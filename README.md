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

This repo ships with a [`vercel.json`](vercel.json) that bumps the `/api/run-step` function timeout to **300 seconds** so Replicate's longest polls can complete. That setting **requires a Vercel Pro plan or higher** — the deploy will fail on the free/hobby tier.

### Step-by-step

1. Push the repo to GitHub / GitLab / Bitbucket.
2. Go to <https://vercel.com/new> and import the repo. Vercel auto-detects the **Next.js** preset.
3. Under **Settings → Environment Variables**, add:
   - `FIRECRAWL_API_KEY`
   - `PORTKEY_API_KEY`
   - `PORTKEY_CONFIG_ID` (default: `pc-portke-0dd3de`)
   - `REPLICATE_API_TOKEN`
4. Confirm the project is on the **Pro** plan (required for the 300s function timeout).
5. Click **Deploy**.
6. After the first deploy succeeds, open the deployed URL, flip **Test Run** OFF, and run one real step end-to-end to verify all four keys are wired.

## Reference

- Pipeline details, prompt catalog, and API integration notes: [`docs/backend-context.md`](docs/backend-context.md)
- Environment variables: [`.env.local.example`](.env.local.example)
