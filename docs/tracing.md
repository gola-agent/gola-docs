# Tracing

Structured logging and observability for agent executions, enabling post-hoc analysis and debugging of agent behavior.

## Overview

The tracing module provides machine-readable traces of agent executions in JSONL format. Each step of the agent's reasoning and tool usage is captured with AI-powered summarization, creating an audit trail that can be ingested by observability platforms for analysis.

## Key Features

- **AI-Powered Summarization**: Automatically generates human-readable summaries of tool interactions
- **Structured JSONL Format**: Machine-readable traces for programmatic analysis
- **Async Processing**: Non-blocking trace generation that doesn't impact agent performance
- **Comprehensive Capture**: Records both agent thoughts and tool executions
- **Thread-Safe**: Handles concurrent trace writes safely

## Configuration

Enable tracing in your agent configuration:

```yaml
tracing:
  enabled: true
  trace_file: "tracing_trace.jsonl"
  model_provider: "default"  # Uses the same LLM as the agent
```

### Configuration Options

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable or disable tracing |
| `trace_file` | string | `"tracing_trace.jsonl"` | Path to the trace output file |
| `model_provider` | string | `"default"` | LLM provider for summarization (currently uses agent's LLM) |

## Trace Format

Traces are written in JSONL (JSON Lines) format, with one JSON object per line:

```json
{
  "timestamp": "2025-01-08T10:30:45Z",
  "step_number": 1,
  "trace_type": "summary",
  "content": "Creating the main application file.",
  "tool_call": {
    "id": "call_123",
    "name": "create_file",
    "arguments": {"path": "app.py", "content": "..."}
  },
  "result": {
    "tool_call_id": "call_123",
    "content": "File created successfully",
    "success": true
  }
}
```

### Trace Fields

- **timestamp**: ISO 8601 timestamp of the trace event
- **step_number**: Sequential step number in the agent execution
- **trace_type**: Either "summary" (for tool calls) or "thought" (for reasoning steps)
- **content**: Human-readable description of what happened
- **tool_call**: Optional tool invocation details
- **result**: Optional tool execution result

## Trace Types

### Tool Call Summaries

When the agent uses a tool, the tracing system:
1. Captures the tool call and its result
2. Sends both to the LLM for summarization
3. Generates a concise, user-facing description

Example summary: "Checking the weather in New York" instead of raw API details.

### Agent Thoughts

When the agent reasons without using tools, the raw thought is captured:

```json
{
  "trace_type": "thought",
  "content": "I need to gather more information before proceeding...",
  "tool_call": null,
  "result": null
}
```

## Usage Examples

### Basic Tracing Setup

```yaml
# gola.yaml
agent:
  name: "Debugging Assistant"

tracing:
  enabled: true
  trace_file: "debug_session.jsonl"  # Custom file name (default: tracing_trace.jsonl)

llm:
  provider: openai
  model: gpt-4o-mini
```

### Analyzing Traces

Process trace files programmatically:

```python
import json

# Read and analyze traces
with open('tracing_trace.jsonl', 'r') as f:
    for line in f:
        trace = json.loads(line)
        if trace['trace_type'] == 'summary':
            print(f"Step {trace['step_number']}: {trace['content']}")
```

### Integration with Observability Platforms

The JSONL format is compatible with log aggregation systems:

```bash
# Stream traces to logging infrastructure
tail -f tracing_trace.jsonl | your-log-shipper

# Convert to other formats
jq -s '.' tracing_trace.jsonl > traces.json
```

## Use Cases

### Debugging Agent Behavior

Traces help identify:
- Infinite loops or repetitive patterns
- Tool call failures and error handling
- Decision-making logic and reasoning chains
- Performance bottlenecks

### Prompt Engineering Optimization

Analyze traces to:
- Understand how prompts affect agent behavior
- Identify areas where the agent struggles
- Measure task completion efficiency
- Compare different prompt strategies

### Audit and Compliance

Maintain records of:
- All tool invocations and their results
- Decision rationale for each action
- Complete execution history
- Error conditions and recovery attempts

## Performance Considerations

- **Async Processing**: Trace generation happens in background tasks
- **Lazy File Creation**: Trace file is only created when first trace is written
- **Minimal Overhead**: Summarization is optional and async
- **Buffered Writes**: File I/O is handled efficiently

## Implementation Details

The tracing system integrates with the agent lifecycle through the `AgentTraceHandler` trait:

1. **Step Completion**: `on_step_complete()` is called after each agent step
2. **Async Task Spawning**: Trace processing happens in separate tokio tasks
3. **Summary Generation**: LLM generates summaries for tool interactions
4. **File Append**: Traces are appended to the JSONL file atomically

## Best Practices

- **Enable for Development**: Use tracing during development and testing
- **Rotate Log Files**: Implement log rotation for long-running agents
- **Monitor File Size**: Trace files can grow large with extensive agent usage
- **Process Asynchronously**: Parse traces in separate processes to avoid blocking
- **Secure Sensitive Data**: Be aware that traces may contain sensitive information from tool calls