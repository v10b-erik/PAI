---
name: _Humanize
description: Rewrite AI text to sound natural and human, English and Norwegian. USE WHEN humanize, make natural, rewrite naturally, sounds like AI, make human, fjern AI-preg, skriv naturlig, naturlig tekst.
---

# _Humanize

Rewrite AI-generated text to sound natural, conversational, and authentic. Supports English and Norwegian (Bokmal).

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_Humanize/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## When to Use

- User says "humanize this" or "make this sound natural"
- User says "this sounds like AI" or "rewrite naturally"
- User says "fjern AI-preg" or "skriv naturlig" or "naturlig tekst"
- User pastes text and asks for it to sound more human
- After generating content that needs a natural polish

## Workflow Routing

| Trigger | Workflow |
|---------|----------|
| "humanize", "make natural", "rewrite" | `workflows/Rewrite.md` |
| "check" + "AI", "detect", "sjekk" | `workflows/Check.md` |

## Language Detection

Auto-detect the language of the input text:
- If Norwegian: apply Norwegian rules and examples
- If English: apply English rules and examples
- If mixed: match each section to its language
- User can override with "in English" / "pa norsk"

## Quick Usage

Paste or pipe text, then:
- "humanize this"
- "make this sound like a real person wrote it"
- "gjor denne teksten mer naturlig"
