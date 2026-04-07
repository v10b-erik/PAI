# Workflow: Check

Analyze text for AI-sounding patterns without rewriting. Returns a short report.

## Steps

1. **Detect language** of the input
2. **Scan** for banned words/phrases from the Rewrite workflow lists
3. **Check structure** for AI tells:
   - Uniform sentence length
   - Repetitive openers
   - Passive voice overuse
   - Bullet points with bolded title + rephrasing
   - Empty analysis tails (-ing fillers)
   - Hollow transitions
4. **Score** the text: Low / Medium / High AI-feel
5. **Output** a brief report

## Output Format

```
AI-FEEL: [Low / Medium / High]

FOUND:
- [specific issue]: "[quoted example from text]"
- [specific issue]: "[quoted example from text]"

SUGGESTION: [one-sentence fix recommendation]
```

Keep the report short. 3-6 issues max. No rewriting — just diagnosis.
