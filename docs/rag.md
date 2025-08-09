# RAG Agent Example

Want your agent to actually know about YOUR documentation instead of hallucinating? That's what RAG is for. Feed it your docs, it answers questions about them.

## RAG Building Blocks

### Embeddings Configuration
How your text becomes searchable vectors:

```yaml
rag:
  embeddings:
    provider: openai                    # Embedding service provider
    model: "text-embedding-3-small"    # Specific embedding model
    dimension: 1536                     # Vector dimensions
    batch_size: 20                      # Process chunks in batches
    auth:
      api_key_env: "OPENAI_API_KEY"    # API authentication
```

### Text Processing
Chop up your docs into bite-sized pieces:

```yaml
rag:
  text_processing:
    chunk_size: 800                     # Maximum characters per chunk
    chunk_overlap: 100                  # Overlap between chunks
    splitter_type: markdown             # How to split text (markdown/basic)
```

### Vector Store
Configuration for storing embedded vectors:

```yaml
rag:
  vector_store:
    store_type: inmemory               # Storage type (inmemory/persistent)
    persistence: null                  # Persistence configuration
```

### Document Sources
Tell it what to read:

```yaml
rag:
  document_sources:
    - source_type:
        type: files                    # Source type (files/directory/url/inline)
        paths:
          - "docs/guide.md"            # Specific files to include
          - "docs/api.md"
```

### Retrieval Settings
Configuration for finding relevant content:

```yaml
rag:
  retrieval:
    top_k: 5                          # Number of chunks to retrieve
    similarity_threshold: 0.7          # Minimum similarity score
```

### Embedding Cache
Don't regenerate embeddings for the same text twice:

```yaml
rag:
  embedding_cache:
    max_size: 1000                    # Maximum cached embeddings
    persistent: false                  # Save cache between sessions
    eviction_strategy: LRU            # Cache eviction policy
```

## Complete Configuration Example

```yaml
# rag-agent.yaml
agent:
  name: "Knowledge Assistant"
  description: "AI assistant with access to technical documentation and knowledge base"
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

rag:
  enabled: true
  embeddings:
    provider: openai
    model: "text-embedding-3-small"
    dimension: 1536
    batch_size: 20
    auth:
      api_key_env: "OPENAI_API_KEY"
  
  text_processing:
    chunk_size: 800
    chunk_overlap: 100
    splitter_type: markdown
  
  vector_store:
    store_type: inmemory
    persistence: null
  
  document_sources:
    - source_type:
        type: files
        paths:
          - "docs/guide.md"
          - "docs/api.md"
          - "docs/troubleshooting.md"
  
  retrieval:
    top_k: 5
    similarity_threshold: 0.7
  
  embedding_cache:
    max_size: 1000
    persistent: false
    eviction_strategy: LRU
```

## What You Get with RAG

- **Real answers from real docs** - No more "In general, configuration files often..." 
- **"According to api.md..."** - Know exactly where info comes from
- **Your actual variable names** - Not made-up examples
- **System-specific answers** - Knows YOUR setup, not generic best practices
- **Process once, use forever** - Docs get indexed once, then instant retrieval
- **Cross-doc intelligence** - Pulls from multiple files to build complete answers

## Quick Tips

**Chunk size matters**: Too small = lost context. Too big = irrelevant noise. 800 chars is a good start.

**Overlap prevents split sentences**: That 100-char overlap means you won't lose meaning at chunk boundaries.

**More isn't always better**: `top_k: 5` usually beats `top_k: 20`. Quality over quantity.

**Cache or cry**: Without embedding cache, you'll regenerate the same embeddings every restart. Waste of time and money.

**Start with inmemory**: Get it working first, then worry about persistence.

## Common Gotcha

If your agent says "I don't have information about that" when you KNOW it's in the docs:
1. Check `similarity_threshold` - might be too high
2. Check your chunk size - might be splitting important context
3. Check the actual files are being loaded (typos in paths happen)

**Pro-tip**: Test RAG with a question you know the answer to. If it can't answer that, something's misconfigured.