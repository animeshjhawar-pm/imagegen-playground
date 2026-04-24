// Blog thumbnail — OLD-flow Step 4 prompt.
//
// Standalone system + user templates. Paste the real prompt body between
// the REPLACE markers.
//
// Interpolation tokens: {{placeholder_description}}, {{business_context}},
// {{company_info}}, {{graphic_token}}, {{brand_lines}}.

export const BLOG_THUMBNAIL_SYSTEM_PROMPT_OLD = `Create a professional blog cover image for a blog post about "{blog_topic}"

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

export const BLOG_THUMBNAIL_USER_TEMPLATE_OLD = `
{ "description": "{{placeholder_description}}" }
`.trim();
