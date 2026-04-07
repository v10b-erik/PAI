# Workflow: ListTasks

List and filter tasks.

## Steps

1. **Parse filter from user request:**
   - No filter → show all pending tasks
   - "today" / "due today" → `due:today`
   - "overdue" → `due.before:today`
   - "this week" → `due.before:eow`
   - Project mention → `project:PROJECT`
   - Priority mention → `priority:H` (or M/L)
   - Tag mention → `+tag`

2. **Execute command:**
   ```bash
   task [FILTER] list
   ```

   Common queries:
   ```bash
   task list                          # All pending
   task due:today list                # Due today
   task due.before:eow list           # Due this week
   task project:home.hive list        # Hive project only
   task priority:H list               # High priority
   task +shopping list                # Tagged shopping
   task project:elvia list            # All work tasks
   ```

3. **Present results:**
   - Format as readable table
   - Highlight overdue tasks
   - Group by project if showing multiple projects

## Context Switching

If user wants to focus on an area:
```bash
task context elvia     # Only Elvia tasks
task context personal  # Personal/home/finance
task context none      # All tasks
```
