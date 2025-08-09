# LLM Providers

Gola works with OpenAI, Anthropic, and Google. Set an API key, pick a model, and you're good to go. It'll even auto-detect which provider to use based on your environment variables.

## Supported Providers

| Provider | Models | Auto-Detection | Streaming |
|----------|--------|----------------|-----------|
| **OpenAI** | GPT-5, GPT-4.1, GPT-4.1-mini, GPT-4o, GPT-4o-mini | ✅ | ✅ |
| **Anthropic** | Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4, Claude 3.5 Sonnet | ✅ | ✅ |
| **Google** | Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash, Gemini 1.5 Pro | ✅ | ✅ |

## Basic Configuration

### OpenAI

```yaml
llm:
  provider: openai
  model: "gpt-4o-mini"
  parameters:
    temperature: 0.7
    max_tokens: 2000
    top_p: 1.0
    frequency_penalty: 0.0
    presence_penalty: 0.0
  auth:
    api_key_env: "OPENAI_API_KEY"
    # or
    api_key: "sk-..."  # Not recommended
```

Environment setup:
```bash
export OPENAI_API_KEY="your-api-key"
```

### Anthropic Claude

```yaml
llm:
  provider: anthropic
  model: "claude-sonnet-4-20250522"
  parameters:
    temperature: 0.7
    max_tokens: 4000
    top_p: 0.9
  auth:
    api_key_env: "ANTHROPIC_API_KEY"
```

Environment setup:
```bash
export ANTHROPIC_API_KEY="your-anthropic-key"
```

### Google Gemini

```yaml
llm:
  provider: gemini
  model: "gemini-2.5-flash"
  parameters:
    temperature: 0.8
    max_tokens: 3000
    top_p: 0.95
  auth:
    api_key_env: "GEMINI_API_KEY"
```

Environment setup:
```bash
export GEMINI_API_KEY="your-gemini-key"
```

## Auto-Detection

Don't want to think about providers? Let Gola figure it out:

```yaml
llm:
  provider: auto  # Automatically select provider
  model: auto     # Use provider's default model
```

Gola checks in this order:
1. `OPENAI_API_KEY` → Uses OpenAI
2. `ANTHROPIC_API_KEY` → Uses Anthropic
3. `GEMINI_API_KEY` → Uses Google

Example auto-detection configuration:

```yaml
agent:
  name: "Smart Assistant"

llm:
  provider: auto
  model: auto
  parameters:
    temperature: 0.7
    max_tokens: 2000
```

What you get:
- Found OpenAI key? Uses GPT-4.1-mini
- Found Anthropic key? Uses Claude Sonnet 4
- Found Gemini key? Uses Gemini 2.5 Flash

## Model Selection

### OpenAI Models

| Model | Description | Context | Cost |
|-------|-------------|---------|------|
| `gpt-5` | Most advanced model with thinking mode | 128k | Very High |
| `gpt-5-thinking` | Extended reasoning mode for complex problems | 128k | Very High |
| `gpt-4.1` | Latest API model with superior coding | 1M | High |
| `gpt-4.1-mini` | Improved mini model | 1M | Medium |
| `gpt-4.1-nano` | Lightweight, fast model | 1M | Low |
| `gpt-4o` | Previous generation Omni model | 128k | High |
| `gpt-4o-mini` | Fast, cost-effective model | 128k | Low |

```yaml
# Best performance with reasoning
llm:
  provider: openai
  model: "gpt-5"

# Superior coding tasks
llm:
  provider: openai
  model: "gpt-4.1"

# High-quality responses
llm:
  provider: openai
  model: "gpt-4o"

# Cost-effective for simple tasks  
llm:
  provider: openai
  model: "gpt-4.1-nano"
```

### Anthropic Models

| Model | Description | Context | Cost |
|-------|-------------|---------|------|
| `claude-opus-4-1-20250805` | Most capable and intelligent model | 200k | Very High |
| `claude-opus-4-20250522` | World's best coding model | 200k | Very High |
| `claude-sonnet-4-20250522` | Superior coding and reasoning | 200k | High |
| `claude-3-5-sonnet-20241022` | Previous generation capable model | 200k | Medium |
| `claude-3-haiku-20240307` | Fast, lightweight model | 200k | Low |

```yaml
# Most advanced reasoning and coding
llm:
  provider: anthropic
  model: "claude-opus-4-1-20250805"

# Complex long-running tasks
llm:
  provider: anthropic
  model: "claude-opus-4-20250522"

# Superior coding and reasoning
llm:
  provider: anthropic
  model: "claude-sonnet-4-20250522"

# Quick responses
llm:
  provider: anthropic
  model: "claude-3-haiku-20240307"
```

### Google Models

| Model | Description | Context | Cost |
|-------|-------------|---------|------|
| `gemini-2.5-pro` | Most intelligent model with thinking capability | 1M | Very High |
| `gemini-2.5-flash` | Fast model with thinking for agentic use | 1M | Medium |
| `gemini-2.5-flash-lite` | Low-cost, high-performance model | 1M | Low |
| `gemini-2.0-flash` | Enhanced speed and multimodal capabilities | 1M | Medium |
| `gemini-2.0-pro` | Advanced reasoning model | 1M | High |
| `gemini-1.5-pro` | Previous generation high-performance | 1M | High |
| `gemini-1.5-flash` | Previous generation fast model | 1M | Low |

```yaml
# Most advanced with thinking mode
llm:
  provider: gemini
  model: "gemini-2.5-pro"

# Fast thinking for agentic tasks
llm:
  provider: gemini
  model: "gemini-2.5-flash"

# Cost-effective high performance
llm:
  provider: gemini
  model: "gemini-2.5-flash-lite"

# Multimodal and real-time
llm:
  provider: gemini  
  model: "gemini-2.0-flash"
```

## Authentication Methods

### Environment Variables (The Right Way)

```yaml
llm:
  auth:
    api_key_env: "OPENAI_API_KEY"
```

### Direct API Keys (Please Don't)

```yaml
llm:
  auth:
    api_key: "sk-proj-..."  # You WILL accidentally commit this
```

### Custom Headers

Using a proxy or need special headers?

```yaml
llm:
  auth:
    api_key_env: "OPENAI_API_KEY"
    headers:
      "Custom-Header": "value"
      "Organization": "org-123"
```

### Alternative Base URLs

Got your own OpenAI-compatible endpoint?

```yaml
llm:
  provider: openai
  base_url: "https://api.custom-provider.com/v1"
  auth:
    api_key_env: "CUSTOM_API_KEY"
```

## Parameter Tuning

### Temperature

How creative do you want your agent to be?

```yaml
llm:
  parameters:
    temperature: 0.0   # Deterministic, factual
    # temperature: 0.3   # Slightly creative
    # temperature: 0.7   # Balanced (default)
    # temperature: 1.0   # Creative, varied
```

### Max Tokens

How long should responses be?

```yaml
llm:
  parameters:
    max_tokens: 500    # Short responses
    # max_tokens: 2000   # Standard responses
    # max_tokens: 4000   # Long-form content
```

### Advanced Parameters

```yaml
llm:
  parameters:
    temperature: 0.7
    max_tokens: 2000
    top_p: 0.9           # Nucleus sampling
    frequency_penalty: 0.1  # Reduce repetition
    presence_penalty: 0.1   # Encourage new topics
    stop: ["```", "END"]    # Stop sequences
```

## Multi-Provider Configuration

Different tasks, different models:

```yaml
# Primary configuration
llm:
  provider: openai
  model: "gpt-4o-mini"

# Override for specific purposes
purposes:
  code_review:
    llm:
      provider: anthropic
      model: "claude-3-5-sonnet-20241022"
      
  quick_response:
    llm:
      provider: openai
      model: "gpt-3.5-turbo"
```

## Provider-Specific Features

### OpenAI Function Calling

```yaml
llm:
  provider: openai
  model: "gpt-4o"
  parameters:
    function_call: "auto"  # Enable function calling
```

### Anthropic System Messages

```yaml
llm:
  provider: anthropic
  parameters:
    system_message_prefix: "You are Claude, an AI assistant."
```

### Gemini Safety Settings

```yaml
llm:
  provider: gemini
  parameters:
    safety_settings:
      - category: "HARM_CATEGORY_HARASSMENT"
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
```

## Cost Optimization

### Picking the Right Model

```yaml
# Development: Use cost-effective models
llm:
  provider: openai
  model: "gpt-4.1-nano"

# Production: Balance cost and quality
llm:
  provider: anthropic
  model: "claude-3-haiku-20240307"  # For simple tasks
  # model: "claude-sonnet-4-20250522"  # For complex tasks
```

### Dynamic Model Selection

Smart models for hard tasks, cheap models for easy ones:

```yaml
purposes:
  simple_qa:
    llm:
      model: "gpt-4.1-nano"
      parameters:
        max_tokens: 500
        
  complex_analysis:
    llm:
      model: "gpt-5"
      parameters:
        max_tokens: 3000
```

### Token Management

```yaml
llm:
  parameters:
    max_tokens: 1000     # Limit response length
    
agent:
  behavior:
    memory:
      max-history-steps: 20  # Limit context size
```

## Error Handling and Fallbacks

### When Things Go Wrong

```yaml
llm:
  provider: openai
  model: "gpt-5"
  fallback:
    provider: anthropic
    model: "claude-3-haiku-20240307"
```

### Rate Limit Handling

```yaml
llm:
  provider: openai
  retry:
    max_attempts: 3
    backoff_factor: 2
    max_delay: 60
```

## Testing Provider Configuration

### Quick Test

```bash
# Run your agent - it'll tell you if something's wrong
gola --config agent.yaml
```

The startup logs show which provider connected successfully.

### Comparing Providers

Want to see which model works best? Make three configs and test:

```bash
# Ask each agent the same questions
gola --config openai-agent.yaml
gola --config anthropic-agent.yaml 
gola --config gemini-agent.yaml
```

You'll quickly see which one fits your needs.

## Example Configurations

### Development Agent

```yaml
agent:
  name: "Development Assistant"

llm:
  provider: auto
  parameters:
    temperature: 0.2  # More deterministic for code
    max_tokens: 2000

mcp_servers:
  - name: "git"
    command:
      command: "uvx"
      args: ["mcp-server-git"]
```

### Research Agent

```yaml
agent:
  name: "Research Assistant"

llm:
  provider: gemini  # Large context for documents
  model: "gemini-2.5-pro"
  parameters:
    temperature: 0.7
    max_tokens: 4000

tools:
  web_search:
    enabled: true
    provider: duckduckgo
```

### Creative Writing Agent

```yaml
agent:
  name: "Creative Writer"

llm:
  provider: anthropic  # Good for creative tasks
  model: "claude-sonnet-4-20250522"
  parameters:
    temperature: 0.9  # More creative
    max_tokens: 3000
```

## Common Problems

**"Provider not found"**

You probably typed the provider name wrong. Valid options:
- `openai`
- `anthropic`
- `gemini`
- `auto` (let Gola pick)

**"Authentication failed"**

Your API key is wrong or not set. Check it:
```bash
echo $OPENAI_API_KEY  # Should show your key, not blank
```

If it's blank, set it:
```bash
export OPENAI_API_KEY="your-actual-key-here"
```

**"Rate limit exceeded"**
```yaml
# Add retry configuration
llm:
  retry:
    max_attempts: 5
    backoff_factor: 2
```

**"Context limit exceeded"**

Your conversation got too long. Fix it:
```yaml
agent:
  behavior:
    memory:
      max-history-steps: 10  # Remember less history

llm:
  parameters:
    max_tokens: 1000  # Shorter responses
```

**Pro-tip:** The `intelligent` eviction strategy helps here - it keeps the important stuff and drops the rest.

Start with `provider: auto` and the default models. Once you know what you're building, pick specific models for specific tasks. The expensive models aren't always better - GPT-4o-mini and Claude Haiku handle most tasks just fine.

Next: [MCP Integration](/mcp/) - Give your agents actual abilities beyond just talking.