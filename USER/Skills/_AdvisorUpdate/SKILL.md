---
name: AdvisorUpdate
description: Update AI advisor Identity.md files with recent content from YouTube, blogs, and podcasts. USE WHEN update advisors, refresh advisors, sync advisor content, advisor update.
---

# AdvisorUpdate Skill

Orchestrates autonomous updates of advisor identity files using search-based content discovery, fabric for YouTube analysis, and Claude synthesis.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/AdvisorUpdate/`

If this directory exists, load and apply any PREFERENCES.md, configurations, or resources found there. These override default behavior. If the directory does not exist, proceed with skill defaults.

## Workflow Routing

| User Intent | Workflow |
|-------------|----------|
| "update all advisors" | `Workflows/UpdateAll.md` |
| "update advisors" | `Workflows/UpdateAll.md` |
| "/advisor-update" | `Workflows/UpdateAll.md` |
| "update [name] advisor" | `Workflows/UpdateOne.md` |
| "/advisor-update peter attia" | `Workflows/UpdateOne.md` |

## Tools Used

| Tool | Purpose |
|------|---------|
| fabric -y | YouTube transcript extraction + analysis |
| Web search | Blog/podcast content discovery |

## Design Decisions

| Decision | Choice |
|----------|--------|
| Synthesis model | Claude |
| Contradictions | Show evolution with dates |
| Low content | Extend search, append only |
| Quote format | "Quote" -- Source, Month Year |
| Commit mode | Always commit |

## Paths

| Item | Path |
|------|------|
| Advisors | `~/code/pai/core/USER/ADVISORS/` |
| State file | `State/tasks.json` (relative to this skill) |
| Git repo | `~/code/pai/core/` |

## Quick Reference

```bash
# Manual trigger
/advisor-update

# Single advisor
/advisor-update peter attia
```
