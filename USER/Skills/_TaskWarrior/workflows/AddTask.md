# Workflow: AddTask

Create a new task from natural language.

## Steps

1. **Parse the user's request:**
   - Extract task description
   - Detect due date keywords → `due:DATE`
   - Detect priority keywords → `priority:H|M|L`
   - Detect project context → `project:AREA.PROJECT`
   - Detect tags → `+tag`

2. **Determine project:**
   - User specified → use directly
   - Auto-detect from working directory or conversation context
   - Use UAS naming: `area.project` (e.g., `home.hive`)

3. **Build and execute command:**
   ```bash
   task add "DESCRIPTION" project:PROJECT [due:DATE] [priority:PRIORITY] [+TAGS]
   ```

4. **Sync to server:**
   ```bash
   task sync
   ```

5. **Confirm to user:**
   - Show task ID, description, project, due date
   - Confirm sync success

## Examples

User: "remind me to review the PR by Friday"
```bash
task add "Review the PR" due:friday project:home.hive
task sync
```

User: "high priority: fix the auth bug for work"
```bash
task add "Fix the auth bug" priority:H project:elvia.cloud
task sync
```

User: "add a task to buy groceries +shopping"
```bash
task add "Buy groceries" +shopping project:home
task sync
```
