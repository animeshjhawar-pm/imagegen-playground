// Blog cover — OLD-flow Step 4 prompt.
//
// Standalone system + user templates (NOT derived from the generic
// Generate Image Prompt). Paste the real prompt body between the
// REPLACE markers.
//
// Available interpolation tokens at call time:
//   {{placeholder_description}}  — picked / typed description from Step 3
//   {{business_context}}         — project additional_info (JSON string)
//   {{company_info}}             — project company_info (JSON string)
//   {{graphic_token}}            — Step 2 output (JSON string)
//   {{brand_lines}}              — "- Label: value" block from graphic_token

export const BLOG_COVER_SYSTEM_PROMPT_OLD = `Create a professional blog cover image for a blog post about "{blog_topic}"

DESIGN REQUIREMENTS:
- Incorporate the company logo prominently but not dominantly (top-left or top-right corner, approximately 10-15% of image width)
- Use a light coloured background that complements the brand's primary color. The primary colour should be incorporated in the design elements.
- Apply secondary and accent colors for visual hierarchy and contrast.
- The blog topic should be present in bold text.
- Ensure the design reflects the blog topic through relevant iconography or imagery.
- Include subtle geometric shapes, gradients, or relevant imagery that complement the brand colors.
- Maintain high contrast for readability.
- Style should align with B2B/professional audience expectations.

MOOD & TONE:
- Professional yet approachable
- Industry-relevant imagery
- Forward-thinking and modern
- Trustworthy and authoritative

The final image should be eye-catching enough for social media while maintaining professional standards suitable for B2B communications.`.trim();

export const BLOG_COVER_USER_TEMPLATE_OLD = `
{ "description": "{{placeholder_description}}" }
`.trim();
