# Getting Started

Gola is a single binary. Download it, add your API key, and you can start building AI agents.

## Download Gola

Grab the binary for your platform from the [releases page](https://github.com/gola-agent/gola/releases/latest):

**Linux:**
```bash
# Download latest release
curl -L -o gola https://github.com/gola-agent/gola/releases/latest/download/gola-linux-amd64

# Make executable
chmod +x gola

# Move to PATH (optional)
sudo mv gola /usr/local/bin/
```

**macOS (Intel):**
```bash
# Download latest release
curl -L -o gola https://github.com/gola-agent/gola/releases/latest/download/gola-macos-amd64

# Make executable
chmod +x gola

# Move to PATH (optional)
sudo mv gola /usr/local/bin/
```

**macOS (Apple Silicon):**
```bash
# Download latest release
curl -L -o gola https://github.com/gola-agent/gola/releases/latest/download/gola-macos-arm64

# Make executable
chmod +x gola

# Move to PATH (optional)
sudo mv gola /usr/local/bin/
```

**Windows:**
```powershell
# Download latest release
Invoke-WebRequest -Uri "https://github.com/gola-agent/gola/releases/latest/download/gola-windows-amd64.exe" -OutFile "gola.exe"
```

**Check it works:**
```bash
gola --version
```

## Prerequisites

You need an API key from one of these providers:
- [OpenAI](https://platform.openai.com/api-keys)
- [Anthropic](https://console.anthropic.com/)
- [Google Gemini](https://ai.google.dev/)

Set it as an environment variable:
```bash
export OPENAI_API_KEY="your-api-key-here"
# or ANTHROPIC_API_KEY, or GEMINI_API_KEY
```

## Model Selection

Gola works great with the smaller, cheaper models like GPT-4o-mini, Claude Haiku, and Gemini Flash. You don't need the expensive ones for most tasks.

## Quick Start

### 1. Create Your First Agent

Make a `gola.yaml` file:

```yaml
agent:
  name: "My First Agent"

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"
```

### 2. Run Your Agent

**Interactive Mode (Default):**
```bash
gola --config gola.yaml
```

This starts an interactive chat session. Type your messages, get responses.

**Headless Server Mode:**

Want to run the agent as a server? Split it into two parts:

```bash
# Terminal 1: Start the server
gola --config gola.yaml --server-only

# Terminal 2: Connect to it
gola --terminal-only --server-url http://127.0.0.1:3001
```

Useful for remote deployments or when you want the UI separate from the agent.

## Example Session

```
> What's the capital of France?

Agent: The capital of France is Paris.

> Can you write a haiku about it?

Agent: Eiffel Tower stands
Seine flows through streets of lights bright
Paris dreams at night
```

## Run Agents from GitHub

Here's something cool: run agents straight from GitHub without cloning anything:

```bash
# Run any agent directly from GitHub (includes config + prompts)
gola --config github:username/my-agent

# Specific version
gola --config github:username/my-agent@v1.0.0

# Custom path
gola --config github:username/configs/sherpa-agent.yaml
```

Gola pulls the config and all referenced prompt files automatically. Share your agent by sharing a GitHub URL.

## One-Shot Task Execution

Need a quick answer without the chat interface? Use `--task`:

```bash
# Ask a quick question
gola --config gola.yaml --task "What's the weather like today?"

# Process information
gola --config gola.yaml --task "Summarize the latest commits in this repo"

# Run with GitHub agents
gola --config github:username/sherpa-agent --task "Find flights from NYC to Paris"
```

Useful for scripts, CI/CD pipelines, or when you need a one-off answer.

## Adding Tools (MCP Integration)

Give your agent abilities beyond just talking:

```yaml
agent:
  name: "Assistant with Tools"

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

mcp_servers:
  - name: "time"
    command:
      command: "uvx"
      args: ["mcp-server-time"]
    tools: all
    enabled: true
```

Now your agent knows what time it is. Add more MCP servers for file access, web search, database queries—whatever you need.

## Runtime Auto-Download

Don't have Python or Node installed? Gola can download them automatically when needed for MCP servers. Your agents become truly portable—they work anywhere Gola runs.

Learn more: **[Runtime Auto-Download](/runtime-autodownload/)**

## What's Next?

- **[Configuration](/configuration/)** - All the knobs and dials
- **[Examples](/examples/)** - Working agents you can copy
- **[MCP Integration](/mcp/)** - Hook up tools and services
- **[RAG Integration](/rag/)** - Feed your agent documents

## Common Issues

**"No such file or directory"**
- You need a `gola.yaml` in your current directory
- Or tell Gola where it is: `gola --config /path/to/config.yaml`

**"API key not found"**
- Did you export it? Check with: `echo $OPENAI_API_KEY`
- Make sure the env var name in your config matches what you exported

**"Connection refused" (terminal mode)**
- The server needs to be running first (`--server-only`)
- Check if it crashed - look at the server terminal for errors

**Agent seems slow or expensive**
- You're probably using a big model. Switch to gpt-4o-mini or claude-haiku
- Check your `max_tokens` setting - you might be generating way more than needed

That's it. You're running AI agents now.