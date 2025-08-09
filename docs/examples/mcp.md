# MCP Tools Example

This example demonstrates how to add external tool capabilities to agents using Model Context Protocol (MCP) servers, showing filesystem, git, and time tool integration.

## Configuration

```yaml
# mcp-agent.yaml
agent:
  name: "Development Assistant"
  description: "AI assistant with access to development tools"
  max_steps: 15
  behavior:
    memory:
      eviction-strategy: summarize
      max-history-steps: 1000
    continue_on_error: true

llm:
  provider: openai
  model: "gpt-4o-mini"
  auth:
    api_key_env: "OPENAI_API_KEY"

mcp_servers:
  - name: "filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    tools: all
    timeout: 30
    enabled: true
    
  - name: "git"
    command:
      command: "uvx"
      args: ["mcp-server-git"]
    tools: all
    timeout: 30
    enabled: true
    
  - name: "time"
    command:
      command: "uvx"
      args: ["mcp-server-time"]
    tools: all
    timeout: 30
    enabled: true
```

## Prerequisites

Install required MCP servers:

```bash
# Install Node.js MCP servers via npx (no global install needed)
# The filesystem server will be installed on first use

# Install Python MCP servers via uv
pip install uv

# Verify uv is working
uvx --help

# Test MCP server availability
uvx mcp-server-git --help
uvx mcp-server-time --help
```

## Setup

1. Set your OpenAI API key:
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

2. Save the configuration to `mcp-agent.yaml`

3. Navigate to a git repository (for git tools to work):
   ```bash
   cd /path/to/your/git/project
   ```

4. Run the agent:
   ```bash
   gola --config mcp-agent.yaml
   ```

## Available Tools

### Filesystem Tools
- **read_file** - Read file contents
- **write_file** - Write content to files
- **list_directory** - List directory contents
- **search_files** - Search for files matching patterns
- **create_directory** - Create directories
- **delete_file** - Delete files

### Git Tools
- **git_status** - Check repository status
- **git_diff** - Show changes
- **git_add** - Stage files
- **git_commit** - Create commits
- **git_log** - View commit history
- **git_branch** - Branch operations
- **git_checkout** - Switch branches/commits

### Time Tools
- **get_current_time** - Get current date and time
- **format_time** - Format timestamps
- **parse_time** - Parse time strings
- **calculate_time_difference** - Calculate time differences

## Usage Examples

### File Operations

```bash
gola --config mcp-agent.yaml
```

Then interact with the agent:
```
> List all Python files in the current directory
```

Expected interaction:
```
Agent: I'll help you list all Python files in the current directory. Let me check what's here.

[Uses list_directory tool to scan current directory]
[Filters results for .py files]

I found the following Python files in the current directory:
- main.py
- config.py  
- utils.py
- tests/test_main.py
- tests/test_utils.py

Would you like me to examine any of these files or search in subdirectories as well?
```

### Git Operations

```bash
gola --config mcp-agent.yaml
```

Then interact with the agent:
```
> Check the git status and show me the latest commit
```

Expected interaction:
```
Agent: I'll check the git status and show you the latest commit information.

[Uses git_status tool]
Current repository status:
- 2 files modified: src/main.py, README.md  
- 1 file untracked: new_feature.py
- Branch: main
- No staged changes

[Uses git_log tool with limit 1]
Latest commit:
- Hash: abc123def456
- Author: John Doe <john@example.com>
- Date: 2024-01-15 14:30:25
- Message: "Add user authentication feature"

Would you like me to stage any of the modified files or show the diff for specific changes?
```

### Code Analysis and Modification

```bash
gola --config mcp-agent.yaml
```

Then interact with the agent:
```
> Read the main.py file, analyze it, and suggest improvements
```

Expected interaction:
```
Agent: I'll read the main.py file and analyze it for potential improvements.

[Uses read_file tool on main.py]
[Analyzes the code structure, imports, functions, etc.]

Analysis of main.py:

**Current Structure:**
- 45 lines of code
- 3 functions: main(), process_data(), save_results()
- Uses pandas, json libraries

**Suggested Improvements:**

1. **Error Handling**: Add try-catch blocks around file operations
2. **Type Hints**: Add type annotations for better code clarity
3. **Logging**: Replace print statements with proper logging
4. **Constants**: Move hard-coded values to named constants

Would you like me to implement any of these improvements and create an updated version of the file?
```

### Time-Based Operations

```bash
gola --config mcp-agent.yaml
```

Then interact with the agent:
```
> What time is it now? Also check when the last git commit was made and calculate how long ago that was
```

Expected interaction:
```
Agent: I'll get the current time and check when the last commit was made.

[Uses get_current_time tool]
Current time: 2024-01-20 15:45:30 UTC

[Uses git_log tool to get latest commit]
[Uses calculate_time_difference tool]

Last git commit was made on: 2024-01-15 14:30:25 UTC
That was approximately 5 days, 1 hour, and 15 minutes ago.

The commit was: "Add user authentication feature" by John Doe
```

## Terminal Interface Usage

For interactive development, use the terminal interface:

```bash
# Start server
gola --config mcp-agent.yaml --server-only

# Connect terminal (in another window)
gola --terminal-only --server-url http://127.0.0.1:3001
```

Interactive session:
```
> Hi! I'm working on a Python project. Can you help me understand the current state?

Agent: I'd be happy to help you understand your Python project! Let me start by checking the current directory structure and git status.

[Agent automatically uses list_directory and git_status tools]

I can see you're working on a Python project with the following structure:
- src/ (main source code)
- tests/ (test files)  
- requirements.txt (dependencies)
- README.md (documentation)

Git status shows you have some uncommitted changes. Would you like me to:
1. Show you what files have been modified
2. Review the changes in detail
3. Help you organize and commit the changes
4. Analyze the code structure

What would be most helpful?

> Show me what files have been modified and the changes

Agent: I'll show you the modified files and their changes.

[Uses git_status and git_diff tools]

Modified files:
1. **src/auth.py** - 15 lines added, 3 lines removed
2. **tests/test_auth.py** - 25 lines added (new file)

Here are the key changes:

**src/auth.py:**
- Added password hashing function using bcrypt
- Implemented JWT token generation
- Added user session management

**tests/test_auth.py:**
- New test file with comprehensive auth tests
- Tests for password hashing, token generation, and session handling

The changes look like a solid authentication implementation. Would you like me to:
- Review the code quality and suggest improvements
- Help you write additional tests
- Create a commit with these changes
```

## Advanced MCP Configuration

### Selective Tool Access

```yaml
mcp_servers:
  - name: "filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    tools: 
      - "read_file"
      - "list_directory"
      # Excludes write_file, delete_file for safety
    enabled: true
```

### Custom Working Directory

```yaml
mcp_servers:
  - name: "project-filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
      working_dir: "/path/to/project"
    tools: all
    enabled: true
```

### Environment Variables

```yaml
mcp_servers:
  - name: "git"
    command:
      command: "uvx"
      args: ["mcp-server-git"]
      env:
        GIT_AUTHOR_NAME: "Gola Agent"
        GIT_AUTHOR_EMAIL: "agent@company.com"
    tools: all
    enabled: true
```

## Error Handling and Debugging

### Test MCP Server Connectivity

```bash
# Test MCP servers interactively by starting the agent
# The agent will attempt to connect to all configured servers on startup
gola --config mcp-agent.yaml

# Check connection status in the startup logs
# Successful connections will show "Connected to MCP server: [server_name]"
# Failed connections will show detailed error messages
```

### Debug MCP Communication

```yaml
# Add debug logging
agent:
  name: "Development Assistant"
  behavior:
    verbose: true  # Enable verbose logging

mcp_servers:
  - name: "filesystem"
    command:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "."]
    debug:
      log_communication: true  # Log MCP messages
    enabled: true
```

### Handle Tool Failures

```yaml
agent:
  behavior:
    continue_on_error: true  # Continue if a tool fails
    tool_timeout: 60        # Longer timeout for slow operations
```

## Troubleshooting

### Common Issues

**"uvx: command not found"**
```bash
# Install uv package manager
pip install uv

# Or use pipx
pipx install uv

# Verify installation
uvx --version
```

**"npx: command not found"**
```bash
# Install Node.js and npm
# On macOS:
brew install node

# On Ubuntu:
sudo apt update && sudo apt install nodejs npm

# Verify installation
npx --version
```

**"MCP server failed to start"**
```bash
# Test MCP server manually
uvx mcp-server-git --help
npx -y @modelcontextprotocol/server-filesystem --help

# Check if tools are in PATH
which uvx
which npx
```

**"Git operations fail"**
```bash
# Ensure you're in a git repository
git status

# Initialize git repo if needed
git init

# Configure git if needed
git config user.name "Your Name"
git config user.email "your@email.com"
```

## Real-World Applications

This MCP-enabled agent is suitable for:

### Development Workflows
- **Code review** - Analyze files, check git history, suggest improvements
- **Project setup** - Create directory structures, initialize git, write boilerplate
- **Debugging assistance** - Read logs, check file contents, analyze git history
- **Documentation** - Generate README files, code comments, change logs

### File Management
- **Batch operations** - Rename files, organize directories, clean up projects
- **Content analysis** - Search across files, analyze project structure
- **Backup tasks** - Copy important files, create archives

### Git Automation
- **Commit automation** - Stage appropriate files, write commit messages
- **Branch management** - Create feature branches, merge branches
- **Release preparation** - Tag releases, generate change logs

This MCP-enabled configuration transforms a basic conversational agent into a capable development assistant with real-world tool integration capabilities.

## Next Steps

Build on this foundation by:

### Adding More Tools
```yaml
mcp_servers:
  - name: "web-search"
    command:
      command: "uvx"
      args: ["mcp-server-brave-search"]
      env:
        BRAVE_API_KEY: "${BRAVE_API_KEY}"
    tools: all
    enabled: true
```

### Custom MCP Servers
Create domain-specific tools for your workflow

### RAG Integration
Combine MCP tools with knowledge bases for enhanced capabilities

This MCP example transforms a basic conversational agent into a capable development assistant with real-world tool access.

Next: See the [RAG Agent Example](/examples/rag) to add knowledge base capabilities.