# Runtime Auto-Download

Your agent needs Python but the user doesn't have it? No problem. Gola downloads what it needs, when it needs it. No more "please install Python first" in your README.

## How It Works

Gola checks if you have Python/Node/Bun. If not, it downloads them to a local cache and uses those. Your users get:

- **Zero setup** - They run your agent without installing dependencies
- **No conflicts** - Doesn't mess with their system Python
- **Consistency** - Same versions everywhere
- **Tiny Docker images** - Just Gola, no runtimes pre-installed

This is great for sharing agents. No more dependency nightmares.

## Two Ways to Configure MCP Servers

### The Old Way (Requires Pre-installed Runtimes)

```yaml
mcp_servers:
  - name: "time"
    command:
      command: "uvx"  # User must have Python + uvx
      args: ["mcp-server-time"]
    tools: all
    enabled: true
```

**Problem**: Fails if user doesn't have Python

### The Better Way (Auto-Download)

```yaml
mcp_servers:
  - name: "time"
    execution_type:
      type: runtime
      runtime: "python"  # Gola handles this
      entry_point: "mcp-server-time"
      args: ["--local-timezone", "UTC"]
    tools: all
    enabled: true
```

**Result**: Works everywhere, no prerequisites

## Supported Runtimes

### Python Runtime

```yaml
mcp_servers:
  - name: "time"
    execution_type:
      type: runtime
      runtime: "python"
      entry_point: "mcp-server-time"
      args: ["--local-timezone", "UTC"]
    tools: all
    enabled: true
```

- Downloads Python interpreter
- Uses `uvx` for package management
- Installs Python packages automatically

### Node.js Runtime

```yaml
mcp_servers:
  - name: "filesystem"
    execution_type:
      type: runtime
      runtime: "nodejs"
      entry_point: "@modelcontextprotocol/server-filesystem"
      args: ["/tmp/workspace"]
    tools: all
    enabled: true
```

- Downloads Node.js interpreter
- Uses `npx` for package management
- Installs npm packages automatically

### Bun Runtime

```yaml
mcp_servers:
  - name: "filesystem"
    execution_type:
      type: runtime
      runtime: "bun"
      entry_point: "@modelcontextprotocol/server-filesystem"
      args: ["/tmp/workspace"]
    tools: all
    enabled: true
```

- Downloads Bun runtime
- Faster JavaScript execution
- Compatible with npm packages

## Behind the Scenes

### What Happens on First Run

1. You start your agent
2. Gola sees `runtime: "python"`
3. Checks if Python exists locally
4. If not found, downloads Python to `~/.gola/runtimes/`
5. Installs the MCP package
6. Runs your server

Next time? Skip to step 6. Fast.

### Package Managers Used

- **Python**: `uvx` (like npx but for Python)
- **Node.js**: `npx` (you know this one)
- **Bun**: Built-in Bun package manager

### Everything's Isolated

Each MCP server gets its own sandbox:
- Won't mess with system packages
- Can't conflict with other servers
- Easy to clean up (just delete the cache)

## Why This Matters

### Your README Gets Shorter

Before:
```markdown
## Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn
- uvx (install with pip install uvx)
- ...
```

After:
```markdown
## Prerequisites
- Gola
```

### Share Agents Without Fear

```bash
# Your colleague doesn't have Python? Doesn't matter
gola --config github:yourname/cool-agent
```

### Same Versions Everywhere

No more "works on my machine" because:

```yaml
# This agent will work anywhere
agent:
  name: "Universal Assistant"

mcp_servers:
  - name: "filesystem"
    execution_type:
      type: runtime
      runtime: "nodejs"
      entry_point: "@modelcontextprotocol/server-filesystem"
      args: ["."]

  - name: "time"
    execution_type:
      type: runtime
      runtime: "python"
      entry_point: "mcp-server-time"
```

### Tiny Docker Images

```dockerfile
FROM alpine:latest

# Just the basics
RUN apk add --no-cache curl ca-certificates tar bash

# Add Gola
COPY gola /usr/local/bin/
COPY gola.yaml /app/

WORKDIR /app
CMD ["gola", "--config", "gola.yaml", "--server-only"]
```

That's it. 50MB image instead of 500MB with Python and Node baked in.

## Performance Impact

### First Run
The first run is slower:
- Download Python: ~45 seconds
- Install packages: ~20 seconds
- Total: About a minute extra

### Every Run After That
- Check cache: < 1 second
- Start server: Normal speed

One minute penalty once vs. hours of setup documentation? Easy trade.

## When Things Go Wrong

**Can't download runtime?**
- Behind a corporate proxy? Set `HTTP_PROXY`
- Firewall blocking? Talk to IT
- Fall back to the `command` approach with pre-installed runtimes

**Package won't install?**
- Double-check the package name (typos happen)
- Some packages need specific Python/Node versions
- Try installing manually first to debug

**Permission denied?**
- Can't write to `~/.gola/runtimes/`? Check permissions
- Running as root? Don't do that
- Set a custom cache dir if needed

## Advanced Configuration

### Custom Runtime Versions

```yaml
mcp_servers:
  - name: "custom"
    execution_type:
      type: runtime
      runtime: "python"
      version: "3.11"  # Specific version
      entry_point: "my-mcp-server"
```

### Runtime-Specific Environment

```yaml
mcp_servers:
  - name: "configured"
    execution_type:
      type: runtime
      runtime: "nodejs"
      entry_point: "my-server"
      env:
        NODE_ENV: "production"
        CUSTOM_VAR: "value"
```

### Cache Management

```yaml
runtime:
  cache_dir: "/custom/cache/path"
  auto_cleanup: true
  max_cache_size: "1GB"
```

## Manual vs Auto-Download

| What | Manual Install | Auto-Download |
|------|---------------|---------------|
| **Setup time** | Hours of README writing | One minute download |
| **Works on** | Machines with right setup | Any machine with Gola |
| **Updates** | "Please update Python to 3.11" | Handled automatically |
| **Versions** | "Why does it work for you but not me?" | Same everywhere |
| **Disk usage** | System Python = lots | Cached = ~200MB |
| **Cleanup** | Good luck | Delete one folder |

## Best Practices

**For Development:**
- Use auto-download from day one
- Test in Docker to catch issues early
- If you need a specific version, pin it

**For Production:**
- Bake the runtime cache into your Docker image for faster starts
- Monitor first-run downloads (they spike your latency)
- Have a fallback config with `command` if downloads fail

**For Sharing:**
- Always use auto-download for public agents
- Test on a clean machine before publishing
- Put a note in your README: "First run takes a minute to download dependencies"

**Pro-tip:** The auto-download approach isn't always faster, but it's always simpler. And simple wins.