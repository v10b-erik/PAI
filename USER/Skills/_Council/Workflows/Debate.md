# Debate Workflow

Full structured multi-agent debate with 3 rounds and visible transcript.

## Prerequisites

- Topic or question to debate
- Optional: Custom council members (default: architect, designer, engineer, researcher)

## Execution

### Step 1: Announce the Council

Output the debate header:

```markdown
## Council Debate: [Topic]

**Council Members:** [List agents participating]
**Rounds:** 3 (Positions -> Responses -> Synthesis)
```

### Step 2: Round 1 - Initial Positions

Launch 4 parallel Agent calls (one per council member).

**Each agent prompt includes:**
```
You are [Agent Name], [brief role description].

COUNCIL DEBATE - ROUND 1: INITIAL POSITIONS

Topic: [The topic being debated]

Give your initial position on this topic from your specialized perspective.
- Speak in first person as your character
- Be specific and substantive (50-150 words)
- State your key concern, recommendation, or insight
- You'll respond to other council members in Round 2

Your perspective focuses on: [agent's domain]
```

**Agent domains:**
- **Architect**: System design, patterns, scalability, long-term implications
- **Designer**: User experience, accessibility, user needs, interface implications
- **Engineer**: Implementation reality, tech debt, maintenance burden, practical constraints
- **Researcher**: Data, precedent, external examples, what others have done

**Output each response:**
```markdown
### Round 1: Initial Positions

**Architect (Serena):**
[Response]

**Designer (Aditi):**
[Response]

**Engineer (Marcus):**
[Response]

**Researcher (Ava):**
[Response]
```

### Step 3: Round 2 - Responses & Challenges

Launch 4 parallel Agent calls with Round 1 transcript included.

**Each agent prompt includes:**
```
You are [Agent Name], [brief role description].

COUNCIL DEBATE - ROUND 2: RESPONSES & CHALLENGES

Topic: [The topic being debated]

Here's what the council said in Round 1:
[Full Round 1 transcript]

Now respond to the other council members:
- Reference specific points they made ("I disagree with [Name]'s point about X...")
- Challenge assumptions or add nuance
- Build on points you agree with
- Maintain your specialized perspective
- 50-150 words

The value is in genuine intellectual friction -- engage with their actual arguments.
```

### Step 4: Round 3 - Synthesis

Launch 4 parallel Agent calls with Round 1 + Round 2 transcripts.

**Each agent prompt:**
```
You are [Agent Name], [brief role description].

COUNCIL DEBATE - ROUND 3: SYNTHESIS

Topic: [The topic being debated]

Full debate transcript so far:
[Round 1 + Round 2 transcripts]

Final synthesis from your perspective:
- Where does the council agree?
- Where do you still disagree with others?
- What's your final recommendation given the full discussion?
- 50-150 words

Be honest about remaining disagreements -- forced consensus is worse than acknowledged tension.
```

### Step 5: Council Synthesis

After all rounds complete, synthesize:

```markdown
### Council Synthesis

**Areas of Convergence:**
- [Points where 3+ agents agreed]

**Remaining Disagreements:**
- [Points still contested]

**Recommended Path:**
[Based on convergence and weight of arguments]
```

## Custom Council Members

- "Council with security" -> Add security-focused agent
- "Council with writer" -> Add communication-focused agent
- "Just architect and engineer" -> Only those two

## Timing

- Round 1: ~10-20 seconds (parallel)
- Round 2: ~10-20 seconds (parallel)
- Round 3: ~10-20 seconds (parallel)
- Synthesis: ~5 seconds
- **Total: 30-90 seconds**
