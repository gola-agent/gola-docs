# Prompt-defined State Machines

How to build agents that handle complex workflows without writing a single line of code. Everything lives in the prompt.

## The Big Idea

Forget writing if-statements and for-loops. With Gola, you describe what should happen in plain English (well, structured English), and the LLM figures out how to do it.

Here's what replaces traditional code:
1. **Your prompt** becomes the program
2. **MCP tools** are your standard library (files, APIs, databases)
3. **The LLM** is your interpreter

Why this is actually cool:
- Change logic without redeploying code
- Non-programmers can understand and modify workflows
- The same pattern works for any workflow
- No debugging state machines at 3 AM

## The Problem: Agents Are Chaotic

Ever built a multi-step agent? Then you've seen these problems:

- **"What was I doing?"** - Agent forgets its current task mid-conversation
- **Groundhog Day** - "Let me search for flights" (for the 5th time)
- **Amnesia** - "Sorry, what was your destination again?" (user said it 3 messages ago)
- **Domino effect** - One API error and everything falls apart
- **Non-deterministic nightmares** - Works great 80% of the time (useless in production)

## The Solution: Make the Prompt Your State Machine

Instead of hoping the agent remembers what to do, force it to follow a state machine defined entirely in the prompt. No code, just very specific instructions.

### Traditional vs Prompt-Defined

In a traditional system, you'd write code like:
```python
# Traditional approach - requires coding
def handle_booking(state):
    if state.status == "gathering_details":
        details = get_user_input()
        state.update(details)
        state.status = "searching_flights"
    elif state.status == "searching_flights":
        flights = search_api(state.origin, state.destination)
        # ... etc
```

With Gola's prompt-defined approach:
```yaml
# Prompt-defined approach - no code needed
mcp_servers:
  - name: "filesystem"  # Provides state persistence
  - name: "http"        # Provides API access

prompts:
  system: |
    When status is "gathering_details":
    1. Ask user for origin, destination, dates
    2. Use filesystem.write to save state
    3. Update status to "searching_flights"
```

See the difference? No compilation, no deployment. Change the prompt and the behavior changes.

## Core Design Patterns

### Pattern 1: The Four-Step Execution Cycle

This is the secret sauce. Force your agent to follow these steps every single time:

```markdown
Your execution on every turn MUST follow this exact 4-step cycle:

1. **ALWAYS READ THE STATE FIRST**: Use the `read_file` tool to load the JSON from `./itineraries/session_{session_id}/current_state.json`
2. **CHECK THE `status` FIELD**: The value determines your single next action
3. **EXECUTE ONE STEP**: Perform the single action required for the current status
4. **ALWAYS WRITE THE STATE LAST**: Update the JSON state and save it back
```

**Why agents stay controlled:**
- Can't act without checking state first
- Can only do one thing per turn (no confusion)
- State always gets saved (no memory loss)

### Pattern 2: State-to-Action Mapping

Tell the agent EXACTLY what to do in each state. No room for creativity:

```markdown
### Status: `gathering_trip_details`
**Action:**
1. Ask user for: origin, destination, departure date, if round trip
2. **IMMEDIATELY** call `report_progress` with reason "awaiting_input"
3. Do NOT write state or perform any other actions - just wait

**When user provides details:**
1. Update state with their information
2. If cities are ambiguous, ask for clarification
3. Convert cities to IATA codes
4. Write state with status "searching_departing_flights"
```

**The tricks that work:**
- Yell at it with CAPS ("MUST", "IMMEDIATELY", "NEVER")
- Number everything (agents follow numbered lists)
- Be explicit about next states ("set status to X")
- Add guards ("When user responds..." not "If user responds...")

### Pattern 3: Progress Reporting Hooks

These built-in functions let you control when the agent waits vs continues:

```markdown
Use `report_progress` with these specific reasons:

### When to STOP and WAIT:
- **"awaiting_input"**: When asking for trip details
- **"pending_choice"**: When user needs to select from options
- **"need_clarification"**: When resolving ambiguity

### When to CONTINUE:
- **"response_complete"**: After providing information
- **"results_displayed"**: After showing search results
```

**What this gives you:**
- Agent actually waits for user input (novel concept)
- Your UI knows what's happening
- No more agents racing ahead without the user

### Pattern 4: Tell It What NOT to Do

Sometimes you need to be the bad cop:

```markdown
## CRITICAL RULES

1. **NEVER output JSON or technical details to the user**
2. **NEVER call report_progress before showing content**
3. **NEVER try to modify a completed itinerary**
4. **NEVER write the same status repeatedly**
5. **ALWAYS show information FIRST, then call report_progress**
```

**How to be effectively negative:**
- List the DON'Ts explicitly
- Put critical rules at the top (agents read top-down)
- Show examples of wrong behavior to avoid

### Pattern 5: Define Your State Like a Database Schema

Give the agent the COMPLETE structure, even with null values:

```json
All state files must include these fields, even if their values are `null` initially.
{
  "session_id": "session_1234567890",
  "status": "gathering_trip_details",
  "current_date": "2025-08-04",
  "origin_city": null,
  "destination_city": null,
  "departure_date": null,
  "return_date": null,
  "flights": {
    "departure": [],
    "return": []
  },
  "accommodation_options": [],
  "selected_accommodation": null
}
```

**Critical points:**
- Include every field from the start (even if null)
- Use real example values (agents learn by example)
- Keep the same structure throughout (no surprises)

## Advanced Patterns

#### Conditional Branching

Yes, you can do if-then-else in prompts:

```markdown
### Status: `selecting_accommodation`
**When user selects:**
1. Parse the selected property
2. Update state with accommodation details
3. If round trip, status "searching_return_flights"
4. If one-way, status "confirming_itinerary"
```

The LLM handles the logic. You just describe it clearly.

#### Error Recovery

Build resilience into state transitions:

```markdown
### Error Handling
After 3 consecutive API failures:
1. Inform the user of the issue
2. Set status to "error_state"
3. Call `assistant_done` with status "error"

If you receive "loop detected" errors:
1. Read the current state file
2. Check what status you're in
3. Move to the next appropriate status
```

**Good news**: Gola's [guardrails](guardrails.md) catch most of these automatically. Loop detection, context overflow, API failures - all handled. You just need to tell the agent what to do when things work.

#### Session Lifecycle

How to handle "start over" gracefully:

```markdown
### After Completion (assistant_done called)
If the user sends another message:
1. Forget the previous session_id
2. Start fresh as if it's a new conversation
3. Do NOT attempt to read the previous state file
4. Begin with status `gathering_trip_details`
```

#### Make the Agent Check Its Own Work

```markdown
## VALIDATION CHECKLIST
Before calling `report_progress`, ask yourself:
- Have I shown the user what they need to see?
- Have I asked a clear question they can answer?
- Will the user understand what they're confirming?

If NO to any of these, show the information FIRST.
```

## Building Your Own

### MCP Tools You'll Need

At minimum, you need state persistence:

```yaml
mcp_servers:
  # Essential: State persistence
  - name: "filesystem"
    tools: ["read_file", "write_file"]
  
  # Optional: External APIs
  - name: "http"
    tools: ["get", "post"]
  
  # Optional: Database access
  - name: "postgresql"
    tools: ["query", "insert", "update"]
```

### The Template That Actually Works

Copy this, fill in the blanks:

```markdown
You are a [AGENT ROLE] that [PRIMARY FUNCTION]. You use a state file to track progress.

## CRITICAL RULES
1. [RULE 1 - Most important]
2. [RULE 2]
3. [etc...]

## WORKFLOW OVERVIEW
Your workflow follows these main steps:
1. [High-level step 1]
2. [High-level step 2]
3. [etc...]

## STATE MANAGEMENT

### Execution Cycle
[4-step cycle customized for your use case]

### State Transitions

#### Status: `[state_name_1]`
**Action:**
1. [Specific action 1]
2. [Specific action 2]
**Next Status:** `[next_state]`

#### Status: `[state_name_2]`
[etc...]

## ERROR HANDLING
[Error recovery instructions]

## STATE STRUCTURE
[Complete JSON schema with examples]

## VALIDATION
[Self-check instructions]
```

## Real Examples That Work

These have been built and actually run in production:

### Booking Systems
- **States**: searching → selecting → confirming → complete
- **MCP Tools**: `filesystem` (state), `http` (APIs), `email` (confirmations)
- **No Code**: Entire flow defined in prompts, executed via MCP

### Application Wizards
- **States**: personal_info → employment → references → review → submit
- **MCP Tools**: `filesystem` (drafts), `database` (submissions), `pdf` (documents)
- **Validation**: LLM validates against schemas in prompts

### Customer Support
- **States**: identify_issue → gather_details → attempt_solution → escalate_or_resolve
- **MCP Tools**: `zendesk` (tickets), `slack` (escalation), `knowledge_base` (solutions)
- **Dynamic Routing**: LLM interprets issue and chooses appropriate MCP tools

### Onboarding Flows
- **States**: welcome → profile_setup → preferences → tutorial → ready
- **MCP Tools**: `database` (user data), `email` (welcome), `analytics` (tracking)
- **Zero Backend Code**: MCP servers handle all infrastructure

## Common Failures and Fixes

### Agent ignores state file
**Fix**: Start every state instruction with "FIRST, read the state file..."

### Agent does 5 things at once
**Fix**: Add "STOP HERE" after each action

### Agent forgets previous conversation
**Fix**: Add a `conversation_summary` field that accumulates

### Stuck in a loop
**Fix**: Gola's [loop detection](guardrails.md#loop-detection--prevention) catches this, but also add "If you see this state 3 times, move to error_state"

### Unclear what happens next
**Fix**: End every state with "Set status to [specific_next_state]"

### Context gets too big
**Fix**: [Context management](guardrails.md#context-window-management) handles this automatically, but keep your state files small

### Agent wanders off-script
**Fix**: [Workflow drift protection](guardrails.md#workflow-drift-containment) helps, but be explicit: "You may ONLY set status to X or Y"

## Testing Your State Machine

### Test the Happy Path First
1. Run through the entire flow perfectly
2. Verify each state transitions correctly
3. Check the final state file is complete

### Then Break Things
- Give invalid input ("pizza" when asked for a date)
- Stop the agent mid-flow and restart
- Simulate API failures (disconnect network)
- Try to confuse it ("go back", "start over", "wait no")

### Check the Safeguards
- Does it wait for user input?
- Does it recover from errors?
- Can you resume an interrupted session?
- Does completion actually complete?

**Pro-tip**: The best test? Give it to someone who's never seen it before. They'll break it in ways you never imagined.

## Why This Actually Works

The state machine pattern that's been around forever has been moved from code to prompts. The result?

- **Business logic in English** - Product managers can actually read it
- **No deployment** - Change prompt, save file, done
- **Version control** - Your prompts ARE your documentation
- **Debugging** - Read the state file, read the prompt, find the problem

Is it perfect? No. Will it handle every edge case? No. But for 90% of multi-step workflows, it's simpler, faster, and more maintainable than traditional code.

The key insight: LLMs are really good at following detailed instructions. So give them detailed instructions. The state machine pattern just makes those instructions systematic and reliable.

**Start simple**: Build a two-state agent first. Get that working. Then add complexity. Before you know it, you'll have a production-ready workflow running entirely from a prompt.