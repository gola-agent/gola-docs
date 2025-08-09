# Minimal Agent Example

The absolute minimum you need to get an agent running. Three lines of config, one environment variable, done.

## Configuration

```yaml
# minimal-agent.yaml
agent:
  name: "Minimal Test Agent"

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"
```

That's literally it:
- A name (could be anything)
- Which LLM to use (gpt-4o-mini is cheap and good)
- Where to find your API key (from an env var, not hardcoded)

## Setup

1. Set your OpenAI API key:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. Save the configuration to `minimal-agent.yaml`

3. Run the agent:
   ```bash
   gola --config minimal-agent.yaml
   ```

## Usage

### Interactive Mode
```bash
# Start the agent interactively
gola --config minimal-agent.yaml
```

Then you can ask questions directly:
```
> What is 2 + 2?

Agent: 2 + 2 = 4

> Explain Python list comprehensions

Agent: Python list comprehensions provide a concise way to create lists. They consist of brackets containing an expression followed by a for clause, then zero or more for or if clauses...
```

### Terminal Interface
```bash
# Start server
gola --config minimal-agent.yaml --server-only

# Connect with terminal (in another window)
gola --terminal-only --server-url http://127.0.0.1:3001
```

Once connected, you can have normal conversations:
```
> Hello! Can you help me with some basic math?
Agent: Hello! I'd be happy to help you with math. What would you like to work on?

> What's the square root of 144?
Agent: The square root of 144 is 12.

> Can you show me how to calculate that?
Agent: Certainly! Here are a few ways to find the square root of 144:

1. **Perfect square recognition**: 144 is a perfect square because 12 × 12 = 144

2. **Prime factorization method**:
   - 144 = 2⁴ × 3²
   - √144 = √(2⁴ × 3²) = 2² × 3 = 4 × 3 = 12

3. **Long division method** (for verification):
   - You can use the long division algorithm for square roots
   
4. **Calculator verification**: √144 = 12

The answer is 12!
```

## What You Get

### The Good
- It works
- You can chat with it
- Costs almost nothing to run

### The Not-So-Good
- No memory tricks (defaults only)
- Can't do anything (no tools)
- Generic personality (no custom prompts)
- Basic error handling

But hey, it's three lines of YAML. What did you expect?

## Making It Better

Once this works, you can add features:

### Custom Prompts
```yaml
agent:
  name: "Helpful Math Tutor"

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

prompts:
  roles:
    system:
      - content: |
          You are a patient and encouraging math tutor. Always:
          - Break down problems into simple steps
          - Use examples to illustrate concepts
          - Encourage the student when they make progress
          - Ask if they understand before moving on
```

### Memory Management
```yaml
agent:
  name: "Minimal Test Agent"
  behavior:
    memory:
      eviction-strategy: summarize
      max-history-steps: 500
    continue_on_error: true

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"
```

### Multiple Models
```yaml
agent:
  name: "Adaptive Agent"

llm:
  provider: auto  # Automatically select best available provider

purposes:
  simple_qa:
    llm:
      model: "gpt-4o-mini"  # Cost-effective for simple questions
  complex_analysis:
    llm:
      model: "gpt-4o"  # Higher quality for complex tasks
```

## Quick Test

```bash
gola --config minimal-agent.yaml
```

If it starts without errors, you're golden. Try asking it something:
```
> Hello, are you working?

Agent: Hello! Yes, I'm working and ready to help you. What can I assist you with today?

> What can you help me with?

Agent: I can help you with a wide variety of tasks including answering questions, explaining concepts, helping with analysis, and more. What would you like to work on?
```

## When It Doesn't Work

**"No API key found for OpenAI"**
```bash
# Check if environment variable is set
echo $OPENAI_API_KEY

# Set the variable if missing
export OPENAI_API_KEY="your-api-key"
```

**"Configuration file not found"**
```bash
# Verify file exists and path is correct
ls -la minimal-agent.yaml

# Use absolute path if needed
gola --config /full/path/to/minimal-agent.yaml
```

**"Connection refused" (when using terminal)**
```bash
# Ensure server is running
gola --config minimal-agent.yaml --server-only

# Check server is listening
curl http://localhost:3001/health
```

## How It's Known to Work

This config is literally what's used in the test suite (`01_minimal_config`). Every release verifies:
- The YAML parses
- OpenAI connection works
- Agent actually responds
- Server starts properly

If this doesn't work, there's a serious issue.

## Why Bother with Something So Simple?

Good question. This minimal config is perfect for:

- **"Does Gola even work?"** - Start here to find out
- **Quick experiments** - Test an idea without complexity
- **Smoke tests** - Make sure your API keys work
- **Teaching someone** - Show them this first, not the 200-line monster

**Pro-tip**: Always start with minimal. Get it working. Then add complexity. You'll thank yourself when debugging.

Next step: [Add some tools](/examples/mcp) so your agent can actually do things.