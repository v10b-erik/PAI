# Workflow: Navigate

Browse and explore the Hub structure.

## Steps

1. **Determine scope** from user request:
   - Entire hub → list areas
   - Specific area (e.g., "10-19") → list categories
   - Specific category (e.g., "12") → list items
   - Specific item (e.g., "12.04") → load CLAUDE.md

2. **List contents:**
   ```bash
   ls ~/hub/                          # All areas
   ls ~/hub/10-19_vestliveien/        # Categories in area
   ls ~/hub/10-19_vestliveien/12_tech/ # Items in category
   ```

3. **Load context** for a specific item:
   - Read the item's `CLAUDE.md` if it exists
   - Present summary, status, related items
   - Note any sub-items

4. **Cross-reference** related items:
   - Check "Related" section in CLAUDE.md
   - Suggest connections to other JD items

## Output

Present the navigation result concisely:
- For listings: table of ID, name, status
- For items: summary from CLAUDE.md
- Always note related items if cross-referencing
