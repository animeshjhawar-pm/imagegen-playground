// ---------------------------------------------------------------------------
// Parse <image_requirement> tags from the output of stormbreaker's
// IMAGE_PLACEHOLDER Portkey prompt. Tag shape (see
// handlers/create_blog_pages/create_image_placeholders.py:100-105):
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
