---
name: _Veo
description: Google Veo 3 video generation from text prompts. USE WHEN generate video, veo, make a video, create video, text to video, video from prompt.
---

# _Veo

Generate videos from text prompts using Google Veo 3 / 3.1 via Vertex AI. Produces MP4 videos with native audio (dialogue, sound effects, ambiance).

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/_Veo/`

If this directory exists, load and apply:
- `PREFERENCES.md` - User preferences and configuration

## What is Veo?

Veo is Google's video generation model. You describe a scene in text and it creates a short video (4-8 seconds) with matching audio. It understands cinematic language — camera movements, lighting, mood, and can generate dialogue and sound effects.

## Common Things You Can Ask Me

- "Generate a video of a sunset over a Norwegian fjord"
- "Make a video with a close-up of rain drops on a window"
- "Create a vertical video for Instagram of a coffee being poured"
- "Generate a 4K video of northern lights"

## When to Use

- User says "generate a video", "make a video", "veo"
- User wants text-to-video generation
- User wants a video clip with AI-generated audio

## Before Generating — Prompt Review

Before running the script, review and improve the user's prompt using the checklist below. Show the user the enhanced prompt and get confirmation before generating.

### Five-Element Checklist

Every prompt should contain these elements:

1. **Camera** — shot type, angle, movement, lens
   - Shot types: extreme close-up, close-up, medium, full, wide/establishing, over-the-shoulder, two-shot
   - Angles: eye-level, low-angle, high-angle, bird's-eye, dutch angle
   - Movements: static, pan, tilt, dolly, truck, crane, aerial/drone, handheld, tracking, arc (one per clip)
   - Lens: "85mm shallow depth of field", "35mm wide-angle", "50mm medium"

2. **Subject** — specific, detailed physical description
   - Age, hair, clothing, accessories, build, distinctive features

3. **Action** — concrete verb, single primary action
   - "opens umbrella as wind gusts" not "experiences rain"

4. **Setting** — location, time of day, weather, atmosphere
   - "Cobblestone bridge in Prague, overcast afternoon, breath visible"

5. **Style + Audio** — lighting, aesthetic, all sound layers
   - Lighting: "golden hour", "Rembrandt lighting", "neon reflections on wet pavement"
   - Audio has three layers: dialogue, SFX, ambient
   - Always end with: "No subtitles, no text overlay."

### Prompt Rules

- Optimal length: 150-300 characters. Below 100 = generic. Above 400 = unpredictable.
- One subject, one primary action, one camera movement per clip.
- Dialogue uses colon format: `says: Your text here` (quotes trigger subtitles)
- Always specify audio explicitly — without it, Veo often hallucinates a studio audience.
- For camera position, use: "holding a selfie stick (thats where the camera is)"
- Always include negative constraints at the end.

### Example Enhancement

User says: "Make a video of a person in the rain"

Enhanced prompt:
> Medium handheld shot, slow push in, shallow depth of field. Freckled woman in yellow hiking jacket, wet hair. Opens umbrella as wind gusts and rain hits. Cobblestone street, overcast twilight. Moody, high contrast, soft bokeh. Rain pattering on stone, distant traffic. No subtitles, no text overlay.

### Full Reference

For detailed prompting guide with camera language tables, audio templates, JSON structured prompting, and 15+ example prompts, see:
`~/hub/40-49_knowledge/44_references/44.02_veo3-prompting/veo3-prompting-guide.md`

## How to Use

Run the helper script:

```bash
bun run ~/code/pai/core/USER/Skills/_Veo/veo.ts "your enhanced prompt here"
```

With options:

```bash
bun run ~/code/pai/core/USER/Skills/_Veo/veo.ts "prompt" \
  --model veo-3.1 \
  --duration 8 \
  --resolution 1080p \
  --aspect 16:9 \
  --no-audio \
  --count 2 \
  --negative "blurry, low quality"
```

## Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--model` | `veo-3`, `veo-3-fast`, `veo-3.1`, `veo-3.1-fast` | `veo-3` | Model to use |
| `--duration` | `4`, `6`, `8` | `8` | Video length in seconds |
| `--resolution` | `720p`, `1080p`, `4k` | `720p` | Output resolution |
| `--aspect` | `16:9`, `9:16` | `16:9` | Aspect ratio (9:16 for vertical/mobile) |
| `--no-audio` | flag | audio on | Disable audio generation |
| `--count` | `1`-`4` | `1` | Number of variants to generate |
| `--negative` | string | none | What to exclude from the video |
| `--seed` | number | random | For reproducible output |
| `--download` | flag | off | Download MP4 to current directory |
| `--image` | file path | none | Reference image for consistency (up to 3, requires veo-3.1) |

## Models

| Model | Speed | Resolution | Audio | Best For |
|-------|-------|-----------|-------|----------|
| `veo-3` | Standard | Up to 1080p | Yes | High quality, audio |
| `veo-3-fast` | Fast | 720p only | Yes | Quick drafts |
| `veo-3.1` | Standard | Up to 4K | Yes | Highest quality |
| `veo-3.1-fast` | Fast | 720p | No | Cheapest, fastest |

## Pricing

| Model | Per second (no audio) | Per second (with audio) | 8s clip |
|-------|----------------------|------------------------|---------|
| Veo 3 / 3.1 | $0.50 | $0.75 | $6.00 |
| Veo 3 Fast | lower | lower | ~$2-3 |
| Veo 3.1 Fast | $0.10 | -- | $0.80 |

## Workflow

1. User describes what they want (can be vague)
2. Enhance the prompt using the five-element checklist above
3. Present the enhanced prompt to the user with a cost estimate
4. On approval, run the script
5. Report the GCS URI or download location

## Notes

- Generation is async — the script polls until the video is ready
- Output is stored in GCS bucket and optionally downloaded locally
- All output carries SynthID digital watermark
- Maximum 8 seconds per generation
- Veo 3 does not support image-to-video (use Veo 3.1 for that)
- Use `veo-3-fast` or `veo-3.1-fast` for drafts/iteration, then upgrade
- English prompts only
- Reference images (`--image`): up to 3 images of a person/character/product. Veo 3.1 preserves the subject's appearance.
