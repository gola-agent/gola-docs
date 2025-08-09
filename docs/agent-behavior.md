# Agent Behavior & Testing

Here's how to build agents that actually work: write good prompts, pick the right model, connect tools, and test everything.

## Defining Prompts

### Inline Prompts

Put prompts directly in your config:

```yaml
prompts:
  roles:
    system:
      - content: |
          You are a helpful assistant.
          Always be concise and accurate.
```

### Prompt Files

Better for real projects - keep prompts in their own files:

```yaml
prompts:
  roles:
    system:
      - file: "prompts/system/main.md"
    user:
      - file: "prompts/user/welcome.md"
```

### Using Fragments

The smart way - build prompts from reusable pieces:

```yaml
prompts:
  fragments:
    guidelines: "prompts/fragments/guidelines.md"
    context: "prompts/fragments/context.md"
  roles:
    system:
      - content: "You are a helpful assistant."
      - fragment: "guidelines"
      - fragment: "context"
```

## LLM Configuration

### The Minimum You Need

```yaml
llm:
  provider: openai
  model: "gpt-4o"
  auth:
    api_key_env: "OPENAI_API_KEY"
```

### All Your Options

```yaml
# OpenAI
llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

# Anthropic
llm:
  provider: anthropic
  model: "claude-3-5-sonnet-20241022"
  auth:
    api_key_env: "ANTHROPIC_API_KEY"

# Google
llm:
  provider: google
  model: "gemini-1.5-pro"
  auth:
    api_key_env: "GOOGLE_API_KEY"
```

## MCP Configuration

Give your agent actual abilities:

```yaml
mcp_servers:
  - name: "filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    
  - name: "git"
    command:
      command: "uvx"
      args: ["mcp-server-git"]
```

## Running and Testing

### Task Mode

Quick one-off questions without the chat interface:

```bash
gola --config agent.yaml --task "What files are in this directory?"
```

Useful for scripts and automation.

### Embedded Mode

The default - starts both the agent and terminal UI:

```bash
gola --config agent.yaml
```

Or specify a custom port:
```bash
gola --config agent.yaml --bind-addr 127.0.0.1:8080
```

### Persistent Service

Run the agent as a background service (no UI):

```bash
gola --config agent.yaml --server-only --bind-addr 127.0.0.1:3001
```

Then connect from another terminal:
```bash
gola --terminal-only --server-url http://127.0.0.1:3001
```

Great for deployment or when you want the UI separate from the agent.

## Testing Your Agent

### Quick Smoke Test

```bash
# Does it even start?
gola --config agent.yaml --task "Hello"
```

### Test Tool Integration

```bash
# Are MCP servers connecting?
gola --config agent.yaml
# Look for "MCP server 'filesystem' connected" in startup logs
```

### Test Different Scenarios

Create test configs for different scenarios:

```yaml
# test-simple.yaml - Minimal config
agent:
  name: "Test Agent"
llm:
  provider: openai
  model: "gpt-4o-mini"

# test-with-tools.yaml - With MCP servers
# test-with-rag.yaml - With knowledge base
# test-production.yaml - Full production config
```

Run each to verify:
```bash
for config in test-*.yaml; do
  echo "Testing $config"
  gola --config $config --task "What can you do?"
done
```

## Common Patterns

### Development Workflow

1. Start with inline prompts
2. Move to files when they get big
3. Extract common parts to fragments
4. Test with cheap models (gpt-4o-mini)
5. Switch to better models for production

### Debugging Tips

- Turn on verbose mode to see what's happening
- Check startup logs for MCP connection status
- Use task mode for quick iteration
- Test prompts with different models to see behavior changes

**Pro-tip:** Start simple. Get a basic agent working, then add complexity. It's easier to debug a minimal configuration than a 500-line prompt with 10 MCP servers.