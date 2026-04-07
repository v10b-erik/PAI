# UpdateAll Workflow

Update all advisors with recent content from their sources.

## Execution Steps

### Phase 1: Initialize

```
1. Read current state from State/tasks.json (create if doesn't exist)
2. List advisors: ls ~/code/pai/core/USER/ADVISORS/*/ (exclude templates)
3. Log: "Starting advisor update for N advisors"
4. Initialize results array for summary
```

**State file structure:**
```json
{
  "last_run": "ISO8601",
  "run_summary": {
    "advisors_processed": 0,
    "advisors_updated": 0,
    "advisors_skipped": 0,
    "advisors_failed": 0,
    "total_sources_checked": 0,
    "total_items_added": 0
  },
  "advisors": {
    "AdvisorName": {
      "status": "updated|skipped|failed",
      "last_updated": "ISO8601",
      "sources_checked": { "youtube": 0, "blogs": 0, "podcasts": 0 },
      "items_added": { "quotes": 0, "sections": 0, "sources": 0 },
      "file_stats": { "lines_before": 0, "lines_after": 0, "lines_added": 0 },
      "processed_urls": []
    }
  }
}
```

---

### Phase 2: For Each Advisor

Process each advisor directory sequentially:

#### 2.1 Read & Parse

```
- Read ~/code/pai/core/USER/ADVISORS/{Name}/Identity.md
- Parse YAML frontmatter (between --- markers)
- Extract: advisor_id, name, update_enabled, sources
- IF update_enabled == false: skip, add to results as "skipped (disabled)"
```

#### 2.2 Backup

```
- Copy Identity.md to Identity.md.backup
- Store original line count for validation
```

#### 2.3 Fetch Sources (Parallel when possible)

**DEDUPLICATION:** Before processing any URL:
1. Check if URL is in `state.advisors.{Name}.processed_urls`
2. If already processed: skip
3. If new: process and add to processed_urls list

**DATE FILTERING:** Use `last_updated` from frontmatter:
- Search queries should include: `after:{last_updated_date}`

For each enabled source, fetch content:

**YouTube** (if sources.youtube.enabled):
```
1. Web search: "{sources.youtube.search_name} youtube after:{last_updated}"
2. Extract YouTube URLs from results (max 5 videos)
3. SKIP URLs already in processed_urls
4. For each NEW URL, use fabric to extract and analyze:
   fabric -y "{youtube_url}" -p extract_wisdom

5. From fabric output, collect:
   - Key points / ideas
   - Notable quotes with timestamps
   - Topics and themes

6. Format for synthesis (see section 2.3.1)
7. Add processed URLs to list
```

**Blogs** (if sources.blogs.enabled):
```
- IF sources.blogs.url exists: fetch RSS feed
- ELSE: web search "{sources.blogs.search_name} blog after:{last_updated}"
- SKIP URLs already in processed_urls
- Extract key points from NEW posts only
- Add processed URLs to list
```

**Podcasts** (if sources.podcasts.enabled):
```
1. Web search: "{sources.podcasts.search_name} after:{last_updated}"
2. Find recent podcast appearances
3. SKIP URLs already in processed_urls
4. For each NEW podcast:
   a. Check if YouTube version exists
   b. If YouTube URL found: Use fabric -y workflow
   c. If no YouTube version: Extract key points from show notes
5. Add processed URLs to list
```

#### 2.3.1 Format Content for Synthesis

After collecting all content, format for the synthesis prompt:

```
VIDEO TITLE: {title}
SOURCE: YouTube, {publish_date}
URL: {url}

KEY POINTS:
- {key_point_1}
- {key_point_2}

NOTABLE QUOTES:
> "{text}" ({timestamp})

TOPICS: {topics}
---
```

**Selection criteria:**
- Prioritize actionable, memorable quotes revealing new thinking
- Select 1-2 best quotes per video (maximum)
- Skip generic or repetitive content

#### 2.4 Check Content Threshold

```
total_content = videos + posts + episodes

IF total_content < 3:
  - Extend search to 60 days
  - Re-run source fetching

IF still total_content < 3:
  - Set mode = "append_only"

IF total_content == 0:
  - Restore backup, skip advisor
  - Add to results: "skipped (no content)"
  - Continue to next advisor
```

#### 2.5 Synthesize

Use Claude to update the Identity.md:

```
Read the synthesis prompt from Templates/SynthesisPrompt.md
Fill in:
  - {current_identity_md}: the current file content
  - {youtube_insights}: collected YouTube content
  - {blog_posts}: collected blog content
  - {podcast_insights}: collected podcast content
  - {name}: advisor name
  - Counts for each source type

Send to Claude and get updated Identity.md
```

#### 2.6 Validate

```
new_content = synthesis result

CHECKS:
1. Starts with "---" (has frontmatter)
2. Contains "## Core Identity"
3. Contains "## About"
4. Line count >= 80% of original

IF any check fails:
  - Restore from .backup
  - Add to results: "failed ({reason})"
  - Continue to next advisor
```

#### 2.7 Write & Commit

```
- Write new content to Identity.md
- Delete Identity.md.backup
- Git add and commit:
  git -C ~/code/pai/core add USER/ADVISORS/{Name}/Identity.md
  git -C ~/code/pai/core commit -m "Update {Name}: {summary}

  Sources: {video_count} videos, {post_count} posts

  Co-Authored-By: Claude <noreply@anthropic.com>"
- Add to results: "updated ({line_count} lines)"
```

#### 2.8 Update State

```
Update State/tasks.json with:
- advisors.{Name}.status = "updated"
- advisors.{Name}.last_updated = now
- advisors.{Name}.sources_checked counts
- advisors.{Name}.items_added counts
- advisors.{Name}.file_stats
- advisors.{Name}.processed_urls (append new)
```

---

### Phase 3: Finalize

#### 3.1 Git Push

```
git -C ~/code/pai/core push
```

#### 3.2 Build Summary

```
Count results: updated, skipped, failed

Build summary:
"Advisor Update Complete

Updated ({updated_count}):
- {Name}: {details}

Skipped ({skipped_count}):
- {Name}: {reason}

Failed ({failed_count}):
- {Name}: {error}"
```

#### 3.3 Save State

```
Update State/tasks.json:
- last_run = now
- run_summary = totals
```

---

## Example Output

```
Advisor update completed

- 8 advisors processed
- 6 updated, 2 skipped, 0 failed
- 20 sources checked, 14 items added

Peter Attia: +32 lines (2 quotes, 2 sections, 4 sources)
Viktor Farcic: +21 lines (2 quotes, 1 section, 1 source)
Guillermo Rauch: +37 lines (1 quote, 2 sections, 3 sources)
Gwynne Shotwell: skipped (no content found)
Layne Norton: skipped (update_enabled: false)
...

Pushed to v10b-erik/PAI
State saved
```
