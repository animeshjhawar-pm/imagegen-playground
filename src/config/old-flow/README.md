# `old-flow/` prompt directory

Per-step old-flow prompt constants. Each file exports the system and (optionally) user-prompt templates used by one step in the pipeline when running the **Old** flow row.

Files here are hot-reloaded by Next.js dev — edit a template, hit Run, see the result. No pipeline wiring changes are needed unless you add a brand-new constant.

- `cover-prompt.ts` — `BLOG_COVER_SYSTEM_PROMPT_OLD` + `BLOG_COVER_USER_TEMPLATE_OLD` (Step 4 for `blog:cover`).
- `thumbnail-prompt.ts` — `BLOG_THUMBNAIL_SYSTEM_PROMPT_OLD` + `BLOG_THUMBNAIL_USER_TEMPLATE_OLD` (Step 4 for `blog:thumbnail`).

The generic blog Step 4 (external / internal / generic / infographic) still uses `IMAGE_GENERATION_SYSTEM_PROMPT` from the monolithic `../prompts-old-flow.ts` — migrate that into a file here when you want to iterate on it.

**Available interpolation tokens:**
- `{{placeholder_description}}` — picked / typed image description
- `{{business_context}}` — project `additional_info` JSON
- `{{company_info}}` — project `company_info` JSON
- `{{graphic_token}}` — Step 2 output (raw JSON string; old flow usually doesn't reference this)
- `{{brand_lines}}` — rendered "- Label: value" block derived from graphic_token
