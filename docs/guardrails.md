# Guardrails: How Gola Keeps Your Agents from Going Off the Rails

Agents can behave unexpectedly. They get stuck in loops, exceed your context window, or forget what they're doing. Gola's guardrails catch these problems before they become serious issues.

## What Can Go Wrong?

Here's what agents do in the wild:
- Get stuck calling the same tool over and over
- Fill up their context window and crash
- Forget what they were doing halfway through
- Hit rate limits and give up
- Send malformed messages that break the API
- Wander off into completely unrelated tasks

## Core Guardrail Systems

### 1. Loop Detection & Prevention

**The problem**: Your agent keeps doing the same thing, slightly differently each time.

**How Gola fixes it**:
- Watch for similar tool calls happening repeatedly
- Calculate how similar they are (using edit distance)
- Step in when it's obviously stuck

**Configuration**:
```yaml
agent:
  behavior:
    loop_detection:
      enabled: true
      similarity_threshold: 0.85
      window_size: 5
      max_repetitions: 3
```

**Example scenario**:
```
# Agent repeatedly calls the same tool with similar arguments
1. search_files("config.yaml")
2. search_files("config.yml")  
3. search_files("config.yaml")  # Loop detected!
```

### 2. Context Window Management

**The problem**: Conversations get too long and the LLM throws a "context exceeded" error.

**How it's handled**:
- **Summarize large outputs**: Tool outputs exceeding limits get condensed automatically
- **Prioritize recent messages**: Recent messages are retained, older ones are dropped
- **Selective retention**: Never drops system prompts or critical errors
- **Transparency**: Adds notes when truncating so nothing's hidden

**Configuration**:
```yaml
agent:
  behavior:
    memory:
      max_history_steps: 20
      eviction_strategy: "intelligent"
      summarization_threshold: 500  # tokens
      min_recent_steps: 5
```

**Auto-recovery behavior**:
1. Detects context length errors (413, 429 status codes)
2. Summarizes large tool messages first
3. Removes older messages if needed
4. Retries with reduced context
5. Adds truncation notices for transparency

### 3. Message Sequence Validation

**The problem**: LLM APIs are picky about message order. One message out of place and they refuse to work.

**What gets checked**:
- Every tool call has a response (no orphans)
- No two messages in a row from the same role
- Tool responses actually match their tool calls
- System messages are where they belong

**Auto-repair capabilities**:
- Injects missing tool responses
- Merges consecutive same-role messages
- Reorders messages for valid sequence
- Removes orphaned tool responses

### 4. Memory Eviction Strategies

**The problem**: You can't remember everything forever. Something's gotta go.

**Your options**:

#### FIFO (First In, First Out)
- Very simple: oldest content gets deleted first
- Good for: Most use cases
- Bad for: Long workflows where the original goal matters

#### Intelligent Eviction
- Keeps important context (initial task, errors, key tool outputs)
- Good for: Complex agents that need to remember their purpose
- Bad for: Nothing really, this is usually the right choice

#### Chunk-Based
- Removes whole conversation segments at once
- Good for: Multi-turn workflows with distinct phases
- Bad for: Simple Q&A agents

**Configuration**:
```yaml
agent:
  behavior:
    memory:
      eviction_strategy: "intelligent"
      preserve_strategy:
        preserve_initial_task: true
        preserve_errors: false
        preserve_successful_observations: false
        preserve_recent_count: 5
```

### 5. Token Management

**The problem**: Tokens cost money and have limits.

**What Gola does**:
- Count tokens before sending (no surprises)
- Switch to bigger models if needed
- Budget tokens per step so you don't use them all at once
- Compress prompts when they get too long

**Token limits by model** (examples):
- GPT-4: 128K tokens
- Claude 3: 200K tokens  
- Gemini 1.5: 1M tokens

### 6. Rate Limit Handling

**The problem**: Hit the API too fast and you get rate limited.

**Our approach**:
1. See a 429 error? Gola catches it
2. Wait a bit (1 second)
3. Try again (wait 2 seconds if it fails)
4. Keep doubling the wait time
5. Eventually it works (or gives up gracefully)

### 7. Error Recovery & Fallback

**The problem**: Things break. The agent needs to keep going.

**How degradation works**:
1. **First try**: Drop tool outputs that might be causing issues
2. **Still not working?**: Strip it down to just the conversation
3. **Really stuck?**: Start fresh with just the latest message
4. **Give up**: At least tell the user what went wrong and how to fix it

**Configuration**:
```yaml
agent:
  behavior:
    continue_on_error: true
    max_retries: 3
    enable_memory_clearing: false
```

### 8. Step Limiting

**The problem**: Without limits, agents can run forever (and cost you a fortune).

**Simple solution**:
- Set a max number of steps
- When it hits the limit, wrap things up
- Generate a summary of what got done

**Configuration**:
```yaml
agent:
  max_steps: 15  # Maximum reasoning steps
  behavior:
    tool_timeout: 30  # Per-tool execution timeout
```

### 9. Tool Execution Timeouts

**Purpose**: Prevents hanging on slow or unresponsive tools.

**Features**:
- Per-tool configurable timeouts
- Global default timeout
- Automatic cancellation and cleanup
- Error injection for timeout events

### 10. Conversation Consistency

**Purpose**: Maintains coherent conversation flow.

**Mechanisms**:
- Message ordering validation
- Role alternation enforcement
- Context preservation across retries
- State consistency checks

### 11. API Error Resilience

**Purpose**: Handles various API failure modes gracefully.

**Handled error types**:
- Network failures (retry with backoff)
- Authentication errors (fail fast)
- Validation errors (auto-repair)
- Server errors (fallback strategies)
- Timeout errors (reduce payload)

## Keeping Complex Workflows on Track

When you build agents with multiple states (like the Sherpa travel agent), they can drift off course. Here's how that's prevented.

### Things That Go Wrong

1. **Agent forgets where it is**: "Wait, did I already search for flights?"
   - **Fix**: Keep state variables protected in memory
   
2. **Stuck in a state loop**: Searching flights → selecting flight → searching flights again
   - **Fix**: Detect when states repeat

3. **State history gets huge**: Every little state change fills up context
   - **Fix**: Smart eviction that keeps the important state markers

4. **Error recovery causes loops**: Error → retry → error → retry forever
   - **Fix**: Progressive fallback that eventually resets state

### Best Practices for State Machines

1. **Use memory preservation** to protect state variables:
```yaml
agent:
  behavior:
    memory:
      preserve_strategy:
        preserve_initial_task: true  # Keep original goal
        preserve_recent_count: 3     # Keep recent state transitions
```

2. **Configure loop detection** for state-aware monitoring:
```yaml
agent:
  behavior:
    loop_detection:
      state_aware: true  # Consider state in similarity calculation
```

3. **Set appropriate step limits** for workflow complexity:
```yaml
agent:
  max_steps: 25  # Enough for complex workflows
```

## Debugging When Things Go Wrong

### See What's Happening

Turn on verbose mode to watch the guardrails work:

```yaml
agent:
  behavior:
    verbose: true
    show_reasoning: true

logging:
  level: "debug"
```

### What You'll See in Logs

```
[WARN] Loop detected: Similar tool calls in recent history
[INFO] Context truncated: 5 messages removed to fit within limits
[INFO] Successfully recovered from error on attempt 2
[WARN] Context window exceeded, applying truncation
[INFO] Injected synthetic tool response for orphaned call
```

These aren't errors - they're guardrails doing their job.

### Metrics to Monitor

- Loop detection triggers per session
- Context truncation frequency
- Error recovery success rate
- Average retry count
- Token usage efficiency

## Configuration Examples

### Production Config (Maximum Safety)

When you can't afford failures:

```yaml
agent:
  max_steps: 20
  behavior:
    memory:
      max_history_steps: 30
      eviction_strategy: "intelligent"
      preserve_strategy:
        preserve_initial_task: true
        preserve_errors: true
        preserve_successful_observations: true
    loop_detection:
      enabled: true
      similarity_threshold: 0.8
      max_repetitions: 2
    continue_on_error: true
    max_retries: 5
    tool_timeout: 45
```

### Development Config (See Everything)

When you're building and need to see what's happening:

```yaml
agent:
  max_steps: 50
  behavior:
    memory:
      max_history_steps: 100
      eviction_strategy: "fifo"
    loop_detection:
      enabled: false  # Disable during development
    verbose: true
    show_reasoning: true
    continue_on_error: false  # Fail fast for debugging
```

### Cheap and Fast Config

When you need to keep costs down:

```yaml
agent:
  max_steps: 10
  behavior:
    memory:
      max_history_steps: 10
      eviction_strategy: "chunk-based"
      summarization_threshold: 200
      min_recent_steps: 3
    tool_timeout: 15
    max_retries: 2
```

## Fixing Common Problems

**Agent keeps doing the same thing?**
- Make loop detection more sensitive (lower `similarity_threshold`)
- Let it repeat less before stopping (`max_repetitions: 2`)

**Still getting context errors?**
- Keep less history (`max_history_steps: 10`)
- Summarize more aggressively
- Switch to FIFO eviction if intelligent isn't working

**Agent forgets important context?**
- Use intelligent eviction (it's smarter about what to keep)
- Increase `preserve_recent_count`
- Make sure `preserve_initial_task` is true

**Agent stops too soon?**
- Bump up `max_steps`
- Give tools more time (`tool_timeout: 60`)
- Check if loop detection is too aggressive

## The Bottom Line

Guardrails keep your agents from misbehaving. Most of the time, you won't even know they're there—they just quietly fix problems before you notice them.

The defaults work for most use cases. If your agent encounters issues, check the logs. The guardrails will indicate exactly what they're doing and why.

**Pro-tip**: Start with `eviction_strategy: "intelligent"` and `loop_detection: enabled: true`. Those two settings prevent most problems.