# Synthesis Prompt Template

Use this prompt when calling Claude to synthesize the updated Identity.md.

---

You are updating an AI advisor identity file.

## Current Identity

{current_identity_md}

## Recent Content ({total_content} pieces found)

### YouTube ({video_count} videos)
{youtube_insights}

### Blogs ({post_count} posts)
{blog_posts}

### Podcasts ({episode_count} episodes)
{podcast_insights}

## Instructions

### 1. PRESERVE exactly:
- Core Identity section (name, role, based on)
- About {name} section (background, career path)
- These sections define who the advisor IS, not what they think

### 2. UPDATE with recent content:
- Key Philosophy & Quotes: add new quotes
- Leadership Principles: add if new principles emerge
- Practical Approach: update with new recommendations
- Views on {domain}: add new insights
- Sources: add new source URLs

### 3. QUOTE FORMAT (critical):
All new quotes MUST include source and date:
```
> "Quote text here." -- Source Name, Month Year
```

Examples:
> "The best diet is one you can stick to." -- Huberman Lab podcast, Jan 2026
> "Zone 2 training is non-negotiable." -- The Drive #380, Jan 2026

### 4. HANDLING CONTRADICTIONS:
When new content contradicts old positions:
- Keep BOTH positions with dates
- Show the evolution of thinking
- Example:
  "Previously recommended daily fasting (2024). Now advocates flexible eating windows based on individual response (2026), citing new research on metabolic flexibility."

### 5. PRIORITIES:
- Prioritize content from last 14 days
- Maximum 10-15 quotes total in the file
- Older quotes WITHOUT dates can be removed to make room for dated ones
- Newer, dated quotes are more valuable

### 6. FORMAT:
- Maintain exact markdown structure
- Update `last_updated` in frontmatter to today's date
- Keep YAML frontmatter intact (between --- markers)
- Preserve all section headers

### 7. DEDUPLICATION (critical):
Before adding any quote or insight:
1. Check if a similar quote already exists in the current file
2. Check if the same source URL is already in the Sources section
3. If content is essentially the same (even if worded differently): DO NOT add
4. Only add genuinely NEW information not already present

### 8. CRITICAL RULES:
- Output MUST be LONGER than or EQUAL to original
- NEVER truncate or summarize existing content
- NEVER remove sections
- Only ADD content, don't remove (except old undated quotes when at limit)
- If unsure, keep the original content
- NEVER add duplicate quotes or insights

## Output

Return the complete Identity.md file including:
1. YAML frontmatter (with updated last_updated)
2. All sections
3. New content integrated naturally

Do not wrap in code fences. Return the raw markdown.
