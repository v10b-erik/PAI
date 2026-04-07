---
name: _Send
description: Send messages to contacts via email, Slack, SMS. USE WHEN send to, email to, notify, message someone, send email, tell someone, contact someone.
---

# _Send

Send messages to contacts through multiple channels (email via Resend, Slack/SMS via n8n).

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_Send/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## User Confirmation

Ask the user for confirmation before sending any message.

Before invoking Send.ts:
1. Show the user what will be sent (recipient, channel, subject, message)
2. Use AskUserQuestion to get explicit yes/no confirmation
3. Only send if the user confirms

Do not use the `-y` flag without first getting user approval via AskUserQuestion.

## Workflow Routing

| User Intent | Action |
|-------------|--------|
| "send ... to ..." | Show details → Ask confirmation → Send if approved |
| "email ... to ..." | Show details → Ask confirmation → Send if approved |
| "notify ... via ..." | Show details → Ask confirmation → Send if approved |
| "message ... about ..." | Show details → Ask confirmation → Send if approved |
| "tell ... that ..." | Show details → Ask confirmation → Send if approved |

## Tool Reference

| Tool | Usage |
|------|-------|
| `Send.ts` | `bun ~/code/pai/core/USER/Skills/_Send/Tools/Send.ts --to "Name" --message "Content" [--channels "email,slack"] [--subject "Subject"]` |

## Architecture

```
Send.ts
  ├─→ email → Resend API (direct)
  └─→ slack/sms → n8n webhook
```

## Natural Language Examples

**Sending emails:**
- "send Erik an email about the meeting" → sends email to Erik
- "email Alice the meeting notes" → sends email to Alice
- "tell Bob the deploy is complete" → sends to Bob

**Multi-channel:**
- "notify the team via email and slack" → sends to both channels

## Contact Lookup

Contacts are resolved from `~/code/pai/core/USER/CONTACTS.md`.

The tool searches for contact names and retrieves their channel info (email, phone, slack handle).

## Configuration

Edit `config.json` to set:
- `resend.fromEmail` - Sender email address
- `webhookUrl` - n8n webhook for Slack/SMS channels

## Requirements

- Resend API key in 1Password (item: "Resend", field: "homelab_apikey")
- Contacts defined in CONTACTS.md
- n8n webhook (optional, for Slack/SMS)
