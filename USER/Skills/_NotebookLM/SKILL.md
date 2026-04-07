---
name: _NotebookLM
description: Google NotebookLM Enterprise API — create notebooks, manage sources, generate audio overviews and podcasts. USE WHEN notebooklm, notebook, create notebook, add sources, audio overview, generate podcast, notebooklm sources, summarize documents.
---

# _NotebookLM

Interact with Google's NotebookLM Enterprise API from Claude Code. Create notebooks, add sources (text, URLs, YouTube, Drive, file uploads), generate audio overviews and standalone podcasts.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_NotebookLM/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## What is NotebookLM?

NotebookLM is Google's AI research tool. You give it sources — articles, PDFs, YouTube videos, websites, plain text — and it becomes an expert on that material. You can then:

- **Ask questions** about your sources and get grounded answers with citations
- **Generate audio overviews** — two AI hosts discuss your material in a podcast-style conversation
- **Generate standalone podcasts** — same audio format, without creating a notebook first
- **Summarize and cross-reference** multiple documents at once

## Common Things You Can Ask Me

- "Create a notebook from these URLs" — I'll create a notebook and add the sources
- "Make a podcast about this article" — I'll generate audio from the content
- "Add this PDF to my notebook" — I'll upload it as a source
- "List my notebooks" — I'll show what you have
- "Share my notebook with someone" — I'll share it with their email
- "Generate an audio overview focused on X" — I'll create a focused audio discussion

## When to Use

- User says "create a notebook" or "notebooklm"
- User wants to add sources to NotebookLM (URLs, text, files, YouTube, Drive)
- User wants to generate an audio overview or podcast
- User wants to list, share, or manage notebooks
- User wants to upload documents for NotebookLM analysis

## How to Use

Run the helper script with a command and arguments:

```bash
bun run ~/code/pai/core/USER/Skills/_NotebookLM/notebooklm.ts <command> [options]
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `create` | Create a notebook | `notebooklm.ts create --title "Research"` |
| `get` | Get notebook details | `notebooklm.ts get <notebook-id>` |
| `list` | List all notebooks | `notebooklm.ts list` |
| `delete` | Delete a notebook | `notebooklm.ts delete <notebook-id>` |
| `share` | Share a notebook | `notebooklm.ts share <notebook-id> --email user@example.com` |
| `add-sources` | Add sources (batch) | `notebooklm.ts add-sources <notebook-id> --url "https://..." --text "..." --youtube "..." --drive "..."` |
| `upload` | Upload a file as source | `notebooklm.ts upload <notebook-id> --file /path/to/doc.pdf` |
| `get-source` | Get source details | `notebooklm.ts get-source <notebook-id> <source-id>` |
| `delete-source` | Delete a source | `notebooklm.ts delete-source <notebook-id> <source-id>` |
| `audio` | Generate audio overview | `notebooklm.ts audio <notebook-id>` |
| `delete-audio` | Delete audio overview | `notebooklm.ts delete-audio <notebook-id>` |
| `podcast` | Generate standalone podcast | `notebooklm.ts podcast --url "https://..." --text "..." --youtube "..."` |

## Workflows

| Workflow | File | When |
|----------|------|------|
| Create | `workflows/Create.md` | Create notebook and add sources |
| Audio | `workflows/Audio.md` | Generate audio overview or podcast |
| Manage | `workflows/Manage.md` | List, share, delete notebooks and sources |

## Configuration

Requires:
- Google Cloud project with NotebookLM API enabled
- `gcloud` CLI authenticated
- Project number set in `config.json` (see `config.example.json`)

## Quotas

| Resource | Limit |
|----------|-------|
| Notebooks per user | 500 |
| Sources per notebook | 300 |
| Queries per day | 500 |
| Audio overviews per day | 20 |
| Source text size | 500K bytes |
| File upload size | 200 MB |

## Examples

**Research a topic from web articles:**
> "Create a notebook called 'AI Agents' and add these URLs: https://example.com/article1, https://example.com/article2"

**Turn a YouTube video into a podcast discussion:**
> "Generate a podcast from this YouTube video: https://youtube.com/watch?v=..."

**Upload local files for analysis:**
> "Upload ~/Documents/report.pdf to my AI Agents notebook"

**Generate a focused audio overview:**
> "Create an audio overview of my notebook, focused on practical implementation patterns"

**Quick podcast from text (no notebook needed):**
> "Make a podcast about the following: [paste text]"

## Notes

- Audio overview generation is async — the script polls until complete
- Standalone podcast (v1 API) generates audio without creating a notebook
- Supported file types: PDF, TXT, Markdown, HTML, DOCX, PPTX, XLSX, images, audio
- Sources can be: plain text, web URLs, YouTube videos, Google Drive files, uploaded files
- Audio overviews support `--focus` (topic emphasis) and `--lang` (language code)
