# Workflow: Search

Search the Hub for items by content.

## Steps

1. **Parse search intent:**
   - By JD code → resolve directly
   - By topic/keyword → search CLAUDE.md files
   - By status → grep for status fields

2. **Search CLAUDE.md files:**
   Use grep to search across the CLAUDE.md hierarchy:
   ```bash
   grep -rl "SEARCH_TERM" ~/hub/ --include="CLAUDE.md"
   ```

   For broader content search:
   ```bash
   grep -rl "SEARCH_TERM" ~/hub/ --include="*.md"
   ```

3. **Present results:**
   - Show matching items with JD code and path
   - Include relevant context from the match
   - Rank by relevance (CLAUDE.md matches first)

4. **Offer to navigate:**
   - Ask if user wants to load full context for any match
   - Cross-reference related items

## Search Patterns

| User Says | Search Strategy |
|-----------|----------------|
| "find kubernetes" | Grep for "kubernetes" in all .md files |
| "what's 12.04" | Direct JD code resolution |
| "anything about taxes" | Grep in `30-39_finance/` |
| "active projects" | Grep for "Status: Active" in CLAUDE.md files |
