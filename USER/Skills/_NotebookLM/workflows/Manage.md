# Workflow: Manage Notebooks

List, inspect, share, and clean up NotebookLM notebooks and sources.

## List notebooks

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts list
```

## Get notebook details

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts get <notebook-id>
```

## Share a notebook

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts share <notebook-id> --email user@example.com
```

## Inspect a source

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts get-source <notebook-id> <source-id>
```

## Delete a source

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts delete-source <notebook-id> <source-id>
```

## Delete a notebook

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts delete <notebook-id>
```
