# Publishing on GitHub

This guide covers how to publish and share your Gola agents on GitHub, making them discoverable and reusable by the community.

## Repository Structure

### Single Agent Repository

Create a clear structure for your Gola agent:

```mermaid
graph TD
    A[my-gola-agent/] --> A1[README.md]
    A --> A2[gola.yaml]
    A --> A3[prompts/]
    A --> A4[examples/]
    A --> A5[docs/]
    A --> A6[.gitignore]
    
    A3 --> A3a[system/]
    A3 --> A3b[user/]
    A3 --> A3c[fragments/]
    
    A3a --> A3a1[main.md]
    A3b --> A3b1[ice_breaker.md]
    A3c --> A3c1[context.md]
    
    A4 --> A4a[basic-usage.md]
    A4 --> A4b[advanced-config.yaml]
    
    A5 --> A5a[configuration.md]
    
    A1 -.-> A1d[Agent description and usage]
    A2 -.-> A2d[Main configuration]
    A3 -.-> A3d[Prompt files]
    A4 -.-> A4d[Usage examples]
    A5 -.-> A5d[Additional documentation]
    A6 -.-> A6d[Git ignore file]
```

### Multi-Agent Repository

For repositories with multiple agents:

```mermaid
graph TD
    B[gola-agents-collection/] --> B1[README.md]
    B --> B2[agents/]
    B --> B3[scripts/]
    
    B2 --> B2a[customer-support/]
    B2 --> B2b[code-reviewer/]
    B2 --> B2c[data-analyst/]
    
    B2a --> B2a1[README.md]
    B2a --> B2a2[gola.yaml]
    B2a --> B2a3[prompts/]
    
    B2b --> B2b1[README.md]
    B2b --> B2b2[gola.yaml]
    B2b --> B2b3[prompts/]
    
    B2c --> B2c1[README.md]
    B2c --> B2c2[gola.yaml]
    B2c --> B2c3[prompts/]
    
    B3 --> B3a[test-agents.sh]
```

## Repository Documentation

### README.md Template

Create a comprehensive README for your agent:

```markdown
# Agent Name

Brief description of what your agent does and its main use cases.

## Features

- Feature 1 - Brief description
- Feature 2 - Brief description  
- Feature 3 - Brief description

## Prerequisites

- **Gola binary** - Download from [releases](https://github.com/gola-agent/gola/releases/latest)
- **API Keys** - OpenAI, Anthropic, or Google Gemini
- **Additional requirements** - List any specific requirements

## Quick Start

```bash
# Clone the repository
git clone https://github.com/username/agent-name.git
cd agent-name

# Set your API key
export OPENAI_API_KEY="your-api-key"

# Run the agent
gola --config gola.yaml
```

## Configuration

Brief explanation of key configuration options:

```yaml
agent:
  name: "Your Agent"
  description: "What it does"

llm:
  provider: openai
  model: "gpt-4o-mini"

# Highlight important or customizable sections
```

## Usage Examples

### Basic Usage

```bash
gola --config gola.yaml --task "Example query"
```


## Customization

Explain how users can customize the agent:

- Modify prompts in `prompts/` directory
- Adjust configuration in `gola.yaml`
- Add custom tools or MCP servers

## Discoverability

Make your agent easy to find and use:

### Repository Topics

Add relevant GitHub topics to your repository:

- gola
- ai-agent
- llm
- mcp
- yaml-config
- Domain-specific tags (e.g., data-analysis, code-review, customer-support)

### Clear Naming

Use descriptive repository names:

- gola-data-analyst - Clear purpose
- customer-support-agent - Specific use case
- gola-code-reviewer - Tool and function

### Documentation Quality

Ensure your README includes:

- Clear description of agent purpose
- Working examples with expected outputs
- Prerequisites and setup instructions
- Customization guidelines