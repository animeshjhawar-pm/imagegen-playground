// ---------------------------------------------------------------------------
// Extractors for the stormbreaker stored-prompt outputs.
//
// Two shapes to handle:
//
//   1. Blog IMAGE_PLACEHOLDER (pp-blog-image-07032e) returns
//      <image_requirement> tags — see
//      handlers/create_blog_pages/create_image_placeholders.py:100-105
//      and `extractImageRequirementDescription` below.
//
//   2. SERVICE_PAGE_CONTENT_GEN / CATEGORY_PAGE_CONTENT_GEN return a
//      page_info JSON with "images" arrays nested throughout the
//      structure (hero, team.members, service_steps, industries,
//      certifications, etc.). Each image is
//      { context, alt_text, image_id, description }. We want the first
//      non-certification description to seed the downstream image prompt.
//      `extractFirstPageInfoImageDescription` handles that.
// ---------------------------------------------------------------------------
//
//   <image_requirement id="..." type="cover|internal|external|infographic|generic" alt="...">
//     <the actual description>
//   </image_requirement>
//
// The prompt can return multiple tags, one per image slot in the blog.
// The playground's per-client single-image flow wants one of them —
// preferably the one matching the current pipeline's image type.
// ---------------------------------------------------------------------------

import type { ImageType } from "@/config/pipelines";

export function extractImageRequirementDescription(
  output: string,
  imageType?: ImageType
): string {
  if (!output) return "";

  // Try a type-matched tag first when we know the target image type.
  if (imageType) {
    const typed = new RegExp(
      `<image_requirement[^>]*\\btype="${imageType}"[^>]*>([\\s\\S]*?)<\\/image_requirement>`,
      "i"
    );
    const m = output.match(typed);
    if (m) return m[1].trim();
  }

  // Fall back to the first <image_requirement> of any type.
  const any = output.match(
    /<image_requirement[^>]*>([\s\S]*?)<\/image_requirement>/i
  );
  if (any) return any[1].trim();

  // No tags — return the output as-is so downstream steps still see something.
  return output;
}

/**
 * Walk a page_info-shaped JSON string and return the first image
 * description that isn't tagged as a certification logo. Falls back to
 * the raw input when parsing or extraction fails.
 */
export function extractFirstPageInfoImageDescription(output: string): string {
  if (!output) return "";
  try {
    const parsed = JSON.parse(output);
    const desc = walkForImageDescription(parsed);
    if (desc) return desc;
  } catch {
    // not JSON — fall through
  }
  return output;
}

function isCertificationImage(img: unknown): boolean {
  if (!img || typeof img !== "object") return false;
  const ctx = (img as { context?: unknown }).context;
  return typeof ctx === "string" && ctx.toLowerCase().includes("certification");
}

function walkForImageDescription(node: unknown): string | null {
  if (node == null) return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const r = walkForImageDescription(item);
      if (r) return r;
    }
    return null;
  }
  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    // A page_info "images" array is the canonical carrier.
    if (Array.isArray(obj.images)) {
      for (const img of obj.images) {
        if (isCertificationImage(img)) continue;
        const d = (img as { description?: unknown })?.description;
        if (typeof d === "string" && d.trim()) return d.trim();
      }
    }
    for (const key of Object.keys(obj)) {
      const r = walkForImageDescription(obj[key]);
      if (r) return r;
    }
  }
  return null;
}
