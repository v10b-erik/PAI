---
name: _GPT
description: Ask GPT-5.2 for a second opinion or alternative perspective. USE WHEN ask gpt, ask chatgpt, second opinion, what does gpt think, compare with gpt.
---

# _GPT

Query OpenAI GPT-5.2 (via Azure) from within a Claude Code session. Useful for getting a second opinion, comparing approaches, or leveraging GPT's strengths on specific tasks.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_GPT/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## When to Use

- User says "ask GPT" or "what does GPT think"
- User wants a second opinion on a design or approach
- User wants to compare Claude's answer with GPT's
- User explicitly requests GPT for a task

## How to Use

Run the helper script with the prompt as argument:

```bash
bun run ~/code/pai/core/USER/Skills/_GPT/ask-gpt.ts "Your question here"
```

To include a system prompt:

```bash
bun run ~/code/pai/core/USER/Skills/_GPT/ask-gpt.ts "Your question" --system "You are a code reviewer"
```

## Workflow

1. User asks for GPT input on a topic
2. Formulate a clear, self-contained prompt (include relevant context — GPT has no access to the codebase)
3. Run the script
4. Present GPT's response to the user
5. If useful, synthesize both perspectives

## Notes

- GPT does NOT have access to local files — include relevant code/context in the prompt
- Max 4096 completion tokens per request
- API key retrieved from 1Password: `op read "op://Development/Azure OpenAI/key"`
- Model: `gpt-5.2-chat` via Azure Sweden Central
