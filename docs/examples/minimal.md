# Minimal Agent Example

This example demonstrates the simplest possible Gola agent configuration and provides a foundation for building more complex agents.

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

This configuration includes only the essential elements:
- **Agent identity** - A simple name
- **LLM provider** - OpenAI with the cost-effective GPT-4o-mini model
- **Authentication** - API key from environment variable

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

## What This Example Demonstrates

### Core Functionality
- **Basic conversation** - The agent can respond to questions and provide explanations
- **No external tools** - Pure LLM interaction without additional complexity
- **Simple configuration** - Minimal setup required

### Limitations
- **No memory management** - Uses default settings for conversation history
- **No external tools** - Cannot access files, web, or other services
- **No custom prompts** - Uses default system behavior
- **No error handling** - Basic error management only

## Next Steps

This minimal example serves as a starting point. You can enhance it by adding:

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

## Testing

You can test this configuration by starting the agent:

```bash
# Start the agent to test it works
gola --config minimal-agent.yaml
```

Then test with simple queries:
```
> Hello, are you working?

Agent: Hello! Yes, I'm working and ready to help you. What can I assist you with today?

> What can you help me with?

Agent: I can help you with a wide variety of tasks including answering questions, explaining concepts, helping with analysis, and more. What would you like to work on?
```

## Troubleshooting

### Common Issues

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

This minimal configuration provides a solid foundation for building more complex agents with additional features like tools, RAG, or advanced prompting patterns.

## Real-World Applications

While minimal, this configuration is suitable for:

- **Learning Gola** - Understanding basic concepts
- **Prototyping** - Quick agent experiments
- **Simple chatbots** - Basic conversational interfaces
- **Development testing** - Validating LLM connectivity
- **CI/CD testing** - Automated configuration validation

This minimal example proves that Gola agents can be extremely simple while still being functional. It's the foundation upon which more sophisticated agents are built.

Next: See the [MCP Tools Example](/examples/mcp) to add external tool capabilities.