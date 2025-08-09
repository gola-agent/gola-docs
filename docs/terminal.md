# Terminal Interface

The built-in terminal UI for chatting with your agents.

## How It Works

The terminal and agent can run together (default) or separately.

## All-in-One Mode

Run Gola normally:

```bash
gola --config agent.yaml
```

The agent starts, terminal opens, and you're ready to chat.

## The Split Way (Server + Terminal)

Want them separate? Maybe for remote access or debugging:

```bash
# Terminal 1: Start the agent server
gola --config agent.yaml --server-only

# Terminal 2: Connect the UI
gola --terminal-only --server-url http://127.0.0.1:3001
```

Useful when:
- Agent runs on a server, you connect from laptop
- Multiple people need to connect to same agent
- You want to restart the UI without stopping the agent

## Using the Terminal

Usage:
- Type messages and press enter to send
- Use `/` commands for special actions

### Example Session

```
> Hello! Can you help me with a task?

Agent: Hello! I'd be happy to help you with any task. What would you like to work on?

> /help

Available commands:
/help - Show this help message
/quit - Exit the terminal
/clear - Clear the conversation history

> What's 2 + 2?

Agent: 2 + 2 equals 4.

> /quit
Goodbye!
```

## Slash Commands

- `/help` (`/h`) - Provides this help menu
- `/clear` - Clears the current session's memory
- `/quit` (`/q`) or `/exit` - Exit Gola
- `/about` - Displays information about gola-term
- `/copy` (`/c`) - Copies the entire chat history to your clipboard
- `/copy [n]` (`/c [n]`) - Copies only the specified code block to clipboard
- `/append` (`/a`) `[n]` - Appends code blocks to an editor
- `/replace` (`/r`) `[n]` - Replaces selections with code blocks in an editor

## Keyboard Shortcuts

- **Up/Down arrows** - Scroll through conversation
- **Ctrl+U** - Page up
- **Ctrl+D** - Page down
- **Ctrl+C** - Interrupt prompt response if in progress, otherwise exit
- **Ctrl+O** - Insert a line break at cursor position
- **Ctrl+R** - Resubmit your last message to the agent

## When Things Break

**"Connection refused"**
- Is the server actually running? Check the other terminal
- Wrong port? Default is 3001

**"Server not responding"**  
- Server probably crashed. Check its terminal for errors
- Bad config? The server logs will tell you

**Agent behaving unexpectedly?**
- Try `/clear` to reset the conversation
- Check your config - especially the prompts

## Pro Tips

- Use `--bind-addr 0.0.0.0:3001` to allow remote connections (careful with this)
- Pipe output: `echo "question" | gola --config agent.yaml --task`
- The terminal remembers conversation history between reconnects
- Multiple terminals can connect to the same server (shared conversation)

The terminal isn't pretty, but it's functional. For production, you'll probably want to build your own UI using the HTTP API.

## Credits

The terminal interface (`gola-term`) is based on **Dustin Blackman's** [Oatmeal](https://github.com/dustinblackman/oatmeal) - a terminal UI for chatting with LLMs. The fork adapts it specifically for agent interaction:

**What's different from Oatmeal:**
- Connects to Gola agents via HTTP API instead of direct LLM connections
- Removed model selection and configuration (handled by the agent)
- Added session management for persistent conversations
- Integrated with Gola's SSE event stream for real-time responses
- Simplified to focus on agent chat rather than general LLM interaction

Thanks to Dustin for creating such a solid foundation to build on!