# `new-flow/` prompt directory

Per-step new-flow prompt constants. Each file exports the system and (optionally) user-prompt templates used by one step in the pipeline when running the **New** flow row.

Files here are hot-reloaded by Next.js dev — edit a template, hit Run, see the result. No pipeline wiring changes are needed unless you add a brand-new constant.

- `generate-infographic-prompt.ts` — `GENERATE_INFOGRAPHIC_SYSTEM_PROMPT_NEW` + `GENERATE_INFOGRAPHIC_USER_TEMPLATE_NEW` (Step 4 for `blog:infographic`, new flow only).
- `cover-prompt.ts` — `BLOG_COVER_SYSTEM_PROMPT_NEW` + `BLOG_COVER_USER_TEMPLATE_NEW` (Step 4 for `blog:cover`, new flow).
- `thumbnail-prompt.ts` — `BLOG_THUMBNAIL_SYSTEM_PROMPT_NEW` + `BLOG_THUMBNAIL_USER_TEMPLATE_NEW` (Step 4 for `blog:thumbnail`, new flow).

The generic blog Step 4 (external / internal / generic) and the service/category Step 4 still read `IMAGE_GENERATION_SYSTEM_PROMPT_WITH_BRAND` + `BUILD_IMAGE_PROMPT_USER_TEMPLATE_PAGE` from the monolithic `../prompts-new-flow.ts` — migrate those into this folder whenever you want per-step files.

**Available interpolation tokens:**
- `{{placeholder_description}}` — picked / typed image description
- `{{business_context}}` — project `additional_info` JSON
- `{{company_info}}` — project `company_info` JSON
- `{{graphic_token}}` — Step 2 output (raw JSON string)
- `{{brand_lines}}` — rendered "- Label: value" block derived from graphic_token

**Backtick note**
Because prompts are TS template literals, raw backticks (`` ` ``) and raw `${` inside your body will terminate the literal or invoke template-expression parsing. When pasting markdown with inline code, escape every `` ` `` → `` \` `` and every `${` → `\${`. Editors that treat `.ts` files the same as `.js` will flag unescaped occurrences immediately.
