---
name: _Hub
description: Johnny Decimal system navigation, filing, and search. USE WHEN file this OR filing OR navigate hub OR JD codes OR cross-reference OR find in hub OR where to file OR hub search OR in the hub.
---

# _Hub

Integration with Erik's Hub — a Johnny Decimal (JD) organization system at `~/hub/`.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_Hub/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## When to Use

- User says "file this in the hub" or "where should I file this"
- User references a JD code (e.g., "12.04", "50.01")
- User says "what's in category X" or "navigate hub"
- User wants to cross-reference related items
- User says "search the hub for..."

## Hub Structure

```
~/hub/
├── 00-09_meta/          # System, PAI, scratch
├── 10-19_vestliveien/   # Home, house, tech
├── 20-29_personal/      # Health, development
├── 30-39_finance/       # Money, investments, taxes
├── 40-49_knowledge/     # Research, learning, books
├── 50-59_ventures/      # Business ideas
├── 80-89_elvia/         # Work projects
└── 90-99_archive/       # Completed/inactive
```

## Naming Convention

- All lowercase
- `_` after numbers (structural separator)
- `-` between words (word joiner)
- No spaces

Examples: `50-59_ventures/`, `51_active-projects/`, `51.01_ai-network-company/`

## JD Format

| Level | Format | Example |
|-------|--------|---------|
| Area | `XX-YY_name/` | `10-19_vestliveien/` |
| Category | `XX_name/` | `12_tech/` |
| Item (folder) | `XX.YY_name/` | `12.04_hive/` |
| Item (file) | `XX.YY_name.md` | `12.05_setup.md` |
| Sub-item | `XX.YY.ZZ_name/` | `12.04.01_pai-hive/` |

## JD Code Resolution

To resolve a JD code like "12.04":
1. First digit pair = area: `10-19_vestliveien/`
2. First two digits = category: `12_tech/`
3. Full code = item: `12.04_hive/`

Use glob patterns: `ls ~/hub/10-19_vestliveien/12_tech/12.04*/`

## Workflows

| Workflow | File | When |
|----------|------|------|
| Navigate | `workflows/Navigate.md` | Browsing, listing, loading context |
| File | `workflows/File.md` | Creating new items |
| Search | `workflows/Search.md` | Finding items by content |
