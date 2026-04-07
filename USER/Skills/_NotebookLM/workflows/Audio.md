# Workflow: Audio Overview / Podcast

Generate audio content from NotebookLM sources.

## Audio Overview (from existing notebook)

1. **Generate audio overview:**
   ```bash
   bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts audio <notebook-id>
   ```
   The script polls until generation completes, then outputs the audio URI.

2. **Report the result** to the user with the audio URI.

## Standalone Podcast (no notebook needed)

Generate a podcast directly from sources without creating a notebook:

```bash
# From URLs
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts podcast \
  --url "https://example.com/article1" \
  --url "https://example.com/article2"

# From text
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts podcast \
  --text "Content to discuss..."

# Mixed sources
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts podcast \
  --url "https://example.com" \
  --youtube "https://youtube.com/watch?v=abc"
```

## Notes

- Audio overview limit: 20 per day
- Generation is async and may take a minute or more
- To delete an audio overview: `notebooklm.ts delete-audio <notebook-id>`
