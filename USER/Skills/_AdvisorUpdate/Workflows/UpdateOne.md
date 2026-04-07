# UpdateOne Workflow

Update a single advisor with recent content from their sources.

## Input

The advisor name from user input, e.g.:
- `/advisor-update peter attia` -> "peter attia"
- `update mischa advisor` -> "mischa"

## Execution Steps

### 1. Find Advisor

```
- List: ls ~/code/pai/core/USER/ADVISORS/*/
- Match input against directory names (case-insensitive, partial match)
- Examples:
  - "peter attia" matches "PeterAttia"
  - "mischa" matches "MischaVanDenBurg"
  - "viktor" matches "ViktorFarcic"

IF no match found:
  - Report: "No advisor found matching '{input}'"
  - List available advisors
  - Exit

IF multiple matches:
  - Report: "Multiple matches: {list}"
  - Ask user to be more specific
  - Exit
```

### 2. Run Update

Follow the same steps as UpdateAll.md Phase 2, but for the single matched advisor:

1. Read & Parse Identity.md
2. Backup to Identity.md.backup
3. Fetch Sources (YouTube, Blogs, Podcasts)
4. Check Content Threshold (extend to 60 days if needed)
5. Synthesize with Claude
6. Validate output
7. Write & Commit
8. Update State

### 3. Push & Report

```
- Git push
- Report results directly to user
```

## Example Output

```
Updated Peter Attia

Sources:
- YouTube: 3 videos analyzed (fabric)
- Blogs: 2 posts found
- Podcasts: 1 episode

Changes:
- Added 2 new quotes (with attribution)
- Updated Practical Approach section
- Added 1 new source link

Result:
- 167 lines (was 162)
- Committed and pushed
```
