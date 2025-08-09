# MCP Tools Documentation

There are two ways to connect MCP tools to your Gola agents. Pick the one that fits your deployment style.

## Example 1: Use What's Already Installed

Got Node and Python on your system? Use them directly with the `command` approach:

```yaml
# mcp-agent-inherited.yaml
agent:
  name: "Development Assistant"
  description: "AI assistant with filesystem and time tools"

llm:
  provider: openai
  model: "gpt-4.1-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

mcp_servers:
  - name: "filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    tools: all
    enabled: true
    
  - name: "time"
    command:
      command: "uvx"
      args: ["mcp-server-time"]
    tools: all
    enabled: true
```

**What you need**: 
- Node.js with npm (for the `npx` command)
- Python with uv (for the `uvx` command)

**Run it**:
```bash
# Ensure prerequisites are installed
npm --version  # Check Node.js
uvx --version   # Check uv

# Run the agent
gola --config mcp-agent-inherited.yaml
```

## Example 2: Let Gola Handle Everything

Don't have Node or Python? Don't want to install them? No problem. Use the `execution_type` approach and Gola downloads what it needs:

```yaml
# mcp-agent-autodownload.yaml
agent:
  name: "Portable Assistant"
  description: "AI assistant that works anywhere"

llm:
  provider: openai
  model: "gpt-4.1-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

mcp_servers:
  - name: "filesystem"
    execution_type:
      type: runtime
      runtime: "nodejs"
      entry_point: "@modelcontextprotocol/server-filesystem"
      args: ["."]
    tools: all
    enabled: true
    
  - name: "time"
    execution_type:
      type: runtime
      runtime: "python"
      entry_point: "mcp-server-time"
      args: ["--local-timezone", "UTC"]
    tools: all
    enabled: true
```

**What you need**: Nothing. Seriously.

**Run it**:
```bash
# Run it - Gola handles the dependencies
gola --config mcp-agent-autodownload.yaml
```

What happens behind the scenes:
1. Gola checks if it needs Node.js or Python
2. Downloads them to a local cache if missing
3. Installs the MCP server packages
4. Starts everything with proper isolation

**Pro-tip:** This approach is perfect for Docker containers or CI/CD pipelines where you don't want to pre-install runtimes.

For details on the auto-download mechanism, see [Runtime Auto-Download](/runtime-autodownload).

## Which Approach Should You Use?

**Use the `command` approach when:**
- You're running on your dev machine with tools already installed
- You need specific versions of Node or Python
- You want faster startup (no download overhead)

**Use the `execution_type` approach when:**
- You're deploying to environments you don't control
- You want true "zero dependencies" deployment
- You're building Docker containers and want to keep them minimal
- Different team members have different setups

Both approaches use the exact same MCP servers - it's just about how they get launched.