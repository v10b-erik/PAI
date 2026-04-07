---
name: _Share
description: Upload and share files via v10b.no. USE WHEN share file, upload file, share this, make shareable, get share URL, pastebin, share output.
---

# _Share

Upload files and content to get shareable URLs via the Share CLI.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_Share/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## Workflow Routing

| User Intent | Action |
|-------------|--------|
| "share this file" | Upload file with Share CLI |
| "upload and share ..." | Upload file, return URL |
| "make ... shareable" | Upload to share server |
| "share the output of ..." | Pipe command output to share |
| "get a share link for ..." | Upload and return URL |

## Tool Reference

| Tool | Usage |
|------|-------|
| share CLI | `share <file>` or `<command> \| share` |

## Quick Reference

```bash
# Upload a file
share README.md
# Output: https://share.v10b.no/abc123...

# Pipe command output
kubectl get pods | share

# List uploads
share list

# Delete upload
share delete <id>
```

## Architecture

```
share CLI
  |-> File upload -> share server (hive-v2-server:8081)
  |-> Returns URL (share.v10b.no/<id>)
```

## Natural Language Examples

**Uploading files:**
- "share this file with a URL" -> uploads file, returns shareable URL
- "upload README.md so I can share it" -> `share README.md`
- "make this shareable" -> upload current context/file

**Sharing output:**
- "share the output of git log" -> `git log | share`
- "upload my terminal output" -> pipe to share

**Managing uploads:**
- "list my shared files" -> `share list`
- "delete that share" -> `share delete <id>`

## Configuration

Located at `~/.config/share/config.yaml`:
- `server` - Share server URL
- `token` - Auth token

## Requirements

- Share CLI installed (alias `share`)
- Share server running on hive-v2-server
- Auth token configured
