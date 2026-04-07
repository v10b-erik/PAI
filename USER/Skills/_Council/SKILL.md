---
name: Council
description: Multi-agent debate with visible transcripts where agents respond to each other. USE WHEN council, debate, perspectives, weigh options, deliberate, multiple viewpoints. Collaborative-adversarial unlike RedTeam (purely adversarial).
---

# Council Skill

Multi-agent debate system where specialized agents discuss topics in rounds, respond to each other's points, and surface insights through intellectual friction.

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/Council/`

If this directory exists, load and apply any PREFERENCES.md, configurations, or resources found there. These override default behavior. If the directory does not exist, proceed with skill defaults.

## Workflow Routing

| Trigger | Workflow |
|---------|----------|
| Full structured debate (3 rounds, visible transcript) | `Workflows/Debate.md` |
| Quick consensus check (1 round, fast) | `Workflows/Quick.md` |

## Quick Reference

| Workflow | Purpose | Rounds | Output |
|----------|---------|--------|--------|
| **DEBATE** | Full structured discussion | 3 | Complete transcript + synthesis |
| **QUICK** | Fast perspective check | 1 | Initial positions only |

## Council Members

### Default Members

| Agent | Perspective | subagent_type |
|-------|-------------|---------------|
| **Architect** (Serena Blackwood) | System design, patterns, long-term | Architect |
| **Designer** (Aditi Sharma) | UX, user needs, accessibility | Designer |
| **Engineer** (Marcus Webb) | Implementation reality, tech debt | Engineer |
| **Researcher** (Ava Chen) | Data, precedent, external examples | general-purpose |

### Optional Members

| Agent | Perspective | When to Add |
|-------|-------------|-------------|
| **Security** (Rook Blackburn) | Risk, attack surface, compliance | Auth, data, APIs |
| **Fresh Eyes** | Naive questions, fresh perspective | Complex UX, onboarding |
| **Writer** (Emma Hartley) | Communication, documentation | Public-facing, docs |

### Custom Composition

- "Council with security" -- Add security agent
- "Just architect and engineer" -- Only specified members

## Round Structure

### Round 1 - Initial Positions
Each agent gives their take. No interaction yet.

### Round 2 - Responses & Challenges
Each agent reads Round 1 and responds to specific points.

### Round 3 - Synthesis & Convergence
Each agent identifies agreement, disagreement, and final recommendation.

## Output Format

### Debate: 50-150 words per agent per round
### Quick: 30-50 words per agent

## Core Philosophy

Best decisions emerge from diverse perspectives challenging each other. Not just collecting opinions -- genuine intellectual friction where experts respond to each other's actual points.

**Speed:** Parallel execution within rounds. 3-round debate = 30-90 seconds total.

## Examples

```
"Council: Should we use WebSockets or SSE?"
-> DEBATE workflow -> 3-round transcript

"Quick council check: Is this API design reasonable?"
-> QUICK workflow -> Fast perspectives

"Council with security: Evaluate this auth approach"
-> DEBATE with Security agent added
```
