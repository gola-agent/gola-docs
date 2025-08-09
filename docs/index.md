---
layout: home

hero:
  text: "Prompt-defined AI Agents"
  tagline: "Specify capabilities, rollout and share on GitHub."
  image:
    light: /gola_logo_light.png
    dark: /gola_logo_dark.png
    alt: Gola Logo
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/gola-agent/gola

features:
  - title: Zero-Code Agent Creation
    details: YAML config, not code. Describe what you want, not how to build it. No programming required.
  - title: GitHub-Native AI Agent Platform
    details: Share agents like you share code. Fork, improve, pull request. Your agent is just a GitHub URL away.
  - title: Universal Tool Connectivity
    details: MCP built-in. Connect any tool, API, or service that speaks the protocol. No custom integrations needed.
  - title: RAG Integration
    details: Feed it your docs. It answers questions about them. Actually works.
  - title: Multiple LLM Providers
    details: OpenAI, Anthropic, Google. Auto-detects based on your API keys. Switch models with one line.
  - title: Embedded Chat App
    details: Terminal UI included. Start chatting immediately. No frontend required.
---

## Quick Example

Create a simple agent in seconds:

```yaml
# agent.yaml
agent:
  name: "My Assistant"

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
```

Run it:

```bash
# Run the agent
gola --config agent.yaml
```

Then interact with the agent:
```
> What time is it?
```

## GitHub-Native Agent Platform

Your agent is a repo. Share it like code.

```bash
# Run an agent directly from GitHub (fetches config and prompts)
gola --config github:username/sherpa-agent

# Specific version or branch
gola --config github:username/sherpa-agent@v1.2.0

# Custom configuration path
gola --config github:username/agents/customer-support.yaml
```

### Fork, Improve, Share

```bash
# 1. Fork an existing agent
git fork github.com/gola-agent/gola-sherpa-agent

# 2. Customize for your needs
# Edit gola.yaml, add your prompts, configure tools

# 3. Share your improvements
git commit -m "Add corporate travel support"
git push origin main

# 4. Others can use your enhanced version
gola --config github:yourname/gola-sherpa-agent
```

### Why This Matters

- **One command** - `gola --config github:user/agent` and you're running
- **No package registry complexity** - It's just a GitHub repo
- **Version everything** - Tags, branches, releases all work
- **Collaborate naturally** - PRs for prompt improvements? Yes
- **Find agents easily** - GitHub search already works
- **See what you're running** - Config and prompts are right there in the repo

## What People Build

- **Dev tools** - Code review bots, doc generators, debugging assistants
- **Content tools** - Research agents, writing helpers, fact checkers
- **Data tools** - Query runners, report builders, analysis pipelines
- **Ops tools** - Deploy scripts, monitoring alerts, incident responders

## Start Here

- [Get Started](getting-started) - Build your first agent
- [Configuration](configuration) - All the knobs and dials explained
- [Examples](examples/) - Copy these and modify