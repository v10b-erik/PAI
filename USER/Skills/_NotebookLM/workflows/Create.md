# Workflow: Create Notebook

Create a new NotebookLM notebook and populate it with sources.

## Steps

1. **Create the notebook:**
   ```bash
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts create --title "Notebook Title"
   ```
   Note the returned notebook ID.

2. **Add sources** (any combination):
   ```bash
   # Web URLs
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts add-sources <notebook-id> \
     --url "https://example.com/article1" \
     --url "https://example.com/article2"

   # Plain text
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts add-sources <notebook-id> \
     --text "Your text content here"

   # YouTube videos
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts add-sources <notebook-id> \
     --youtube "https://youtube.com/watch?v=..."

   # Google Drive files
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts add-sources <notebook-id> \
     --drive "drive-resource-id"

   # File upload (PDF, TXT, MD, HTML)
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts upload <notebook-id> \
     --file /path/to/document.pdf
   ```

3. **Confirm sources loaded:**
   ```bash
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts get <notebook-id>
   ```

## Output

Report the notebook ID, number of sources added, and any errors.
