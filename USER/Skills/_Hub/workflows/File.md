# Workflow: File

Create a new item in the Hub.

## Steps

1. **Determine the right category:**
   - Ask user or infer from content
   - Check area/category structure for best fit

2. **Find next available ID:**
   - List existing items in the target category
   - Find the highest XX.YY number
   - Assign next sequential ID

3. **Choose item type:**
   - Simple content → single `.md` file
   - Complex item → folder with `CLAUDE.md`

4. **Create the item:**

   For a folder item:
   ```bash
   mkdir ~/hub/XX-YY_area/XX_category/XX.YY_name/
   ```
   Then create `CLAUDE.md` with standard template.

   For a file item:
   Create `~/hub/XX-YY_area/XX_category/XX.YY_name.md`

5. **Update parent CLAUDE.md:**
   - Add the new item to the category's item table
   - Note creation date and initial status

## Naming Rules

- All lowercase
- `_` after the JD number
- `-` between words
- No spaces, no special characters

Examples:
- `41.03_kubernetes/`
- `51.02_side-project.md`

## CLAUDE.md Template (for folder items)

```markdown
# XX.YY Item Name

> **ID:** XX.YY
> **Created:** YYYY-MM-DD
> **Status:** Active

## Summary

One-paragraph description.

## Related

- **XX.YY Other Item** — relationship description
```

## Confirmation

Always confirm with the user before creating:
- Show the proposed path
- Show the proposed ID
- Let user approve or adjust
