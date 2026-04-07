---
name: _TaskWarrior
description: Task management with natural language via TaskWarrior CLI. USE WHEN add a task OR create todo OR remind me OR list tasks OR show todos OR complete task OR mark done OR what tasks OR task list.
---

# _TaskWarrior

Natural language interface to TaskWarrior 3 CLI with Hive server sync.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_TaskWarrior/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## When to Use

- User says "add a task", "remind me to...", "create a todo"
- User says "list tasks", "show my todos", "what's on my plate"
- User says "mark done", "complete task", "finish task"

## Command

The TaskWarrior binary is accessed via:
```bash
task    # alias for simpoir-taskwarrior3.task (snap package)
```

## Sync

Tasks sync to Hive server. Sync runs automatically after add/done operations:
```bash
task sync
```

## UAS Area-to-Project Mapping

The Unified Areas System (UAS) maps Hub areas to TaskWarrior projects:

| Area | Hub Folder | TaskWarrior Project |
|------|------------|---------------------|
| home | `10-19_vestliveien/` | `project:home.*` |
| personal | `20-29_personal/` | `project:personal.*` |
| finance | `30-39_finance/` | `project:finance.*` |
| knowledge | `40-49_knowledge/` | `project:knowledge.*` |
| ventures | `50-59_ventures/` | `project:ventures.*` |
| elvia | `80-89_elvia/` | `project:elvia.*` |

## Auto-Project Detection

When adding a task, detect the project from context:

1. If user specifies a project → use it
2. If working in a Hub directory → infer from JD area
3. If working in `~/code/hive/` → `home.hive`
4. If working in `~/code/pai/` → `meta.pai`
5. Otherwise → ask user or omit project

## Natural Language Parsing

| User Says | TaskWarrior Syntax |
|-----------|--------------------|
| "due tomorrow" | `due:tomorrow` |
| "due next week" | `due:eow+7d` |
| "by Friday" | `due:friday` |
| "in 2 days" | `due:2d` |
| "high priority" / "urgent" | `priority:H` |
| "medium priority" | `priority:M` |
| "low priority" | `priority:L` |
| "for work" / "work task" | `project:elvia` |
| "for hive" | `project:home.hive` |
| "+tag" | `+tag` |

## Workflows

| Workflow | File | When |
|----------|------|------|
| AddTask | `workflows/AddTask.md` | Creating new tasks |
| ListTasks | `workflows/ListTasks.md` | Viewing and filtering tasks |
| CompleteTask | `workflows/CompleteTask.md` | Marking tasks done |

## TaskWarrior Contexts

Switch focus between areas:
```bash
task context elvia      # Only Elvia tasks
task context personal   # Personal/home/finance tasks
task context none       # All tasks
```
