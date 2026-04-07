# Workflow: CompleteTask

Mark a task as done.

## Steps

1. **Identify the task:**
   - User provides task ID → use directly
   - User describes task → search for it:
     ```bash
     task list
     ```
     Find the matching task by description

2. **Complete the task:**
   ```bash
   task TASK_ID done
   ```

3. **Sync to server:**
   ```bash
   task sync
   ```

4. **Confirm to user:**
   - Show which task was completed
   - Confirm sync success

## Examples

User: "mark task 42 as done"
```bash
task 42 done
task sync
```

User: "I finished the PR review"
```bash
task list                    # Find matching task
task MATCHING_ID done        # Complete it
task sync
```
