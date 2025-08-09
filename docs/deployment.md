# Deployment

How to get your agent running in production. Binary on a server, Docker container, systemd service - choose your approach.

## Direct Binary Deployment

### What You Need

- The Gola binary ([grab it here](https://github.com/gola-agent/gola/releases/latest))
- Your config files (`gola.yaml`, prompts, etc.)
- API keys as env vars

### Basic Setup

```bash
# Download and install Gola binary
wget https://github.com/gola-agent/gola/releases/latest/download/gola-linux-amd64
chmod +x gola-linux-amd64
sudo mv gola-linux-amd64 /usr/local/bin/gola

# Set up your project
mkdir -p /opt/gola
cd /opt/gola

# Copy your configuration and prompts
cp gola.yaml /opt/gola/
cp -r prompts/ /opt/gola/

# Set environment variables (choose your provider)
export OPENAI_API_KEY="your-openai-key"
# export ANTHROPIC_API_KEY="your-anthropic-key"
# export GOOGLE_API_KEY="your-gemini-key"

# Run the agent
gola --config gola.yaml --server-only
```

### Systemd Service

For when you want it to start on boot and restart when it crashes:

```bash
# /etc/systemd/system/gola.service
[Unit]
Description=Gola AI Agent
After=network.target
Wants=network.target

[Service]
Type=simple
User=gola
Group=gola
WorkingDirectory=/opt/gola
ExecStart=/usr/local/bin/gola --config /opt/gola/gola.yaml --server-only --bind-addr 0.0.0.0:3001
Restart=always
RestartSec=5
Environment=OPENAI_API_KEY=your-openai-key
Environment=ANTHROPIC_API_KEY=your-anthropic-key
Environment=GOOGLE_API_KEY=your-gemini-key
Environment=RUST_LOG=info

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/gola

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Create gola user
sudo useradd -r -s /bin/false -d /opt/gola gola
sudo chown -R gola:gola /opt/gola

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable gola
sudo systemctl start gola

# Check status
sudo systemctl status gola
```

### Using Supervisor Instead

Prefer Supervisor? Here you go:

```ini
# /etc/supervisor/conf.d/gola.conf
[program:gola]
command=/usr/local/bin/gola --config /opt/gola/gola.yaml --server-only --bind-addr 0.0.0.0:3001
directory=/opt/gola
user=gola
group=gola
autostart=true
autorestart=true
startretries=3
redirect_stderr=true
stdout_logfile=/var/log/gola/gola.log
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=5
environment=OPENAI_API_KEY="your-openai-key",ANTHROPIC_API_KEY="your-anthropic-key",GOOGLE_API_KEY="your-gemini-key",RUST_LOG="info"
```

## Docker Deployment

### Minimal Docker (Tiny and Fast)

20MB image, minimal size:

```dockerfile
# Minimal Dockerfile using Alpine
FROM alpine:latest

# Install basic dependencies
RUN apk update && apk add --no-cache \
    ca-certificates \
    curl

# Download and install Gola binary
RUN curl -L https://github.com/gola-agent/gola/releases/latest/download/gola-linux-amd64 \
    -o /usr/local/bin/gola && \
    chmod +x /usr/local/bin/gola

# Create app directory
WORKDIR /app
COPY gola.yaml ./
COPY prompts/ ./prompts/

# Create non-root user
RUN adduser -D -s /bin/sh -h /app gola && \
    chown -R gola:gola /app

USER gola

EXPOSE 3001

CMD ["gola", "--config", "gola.yaml", "--server-only", "--bind-addr", "0.0.0.0:3001"]
```

### Docker with Python MCP Support

Need Python-based MCP servers? This adds Python to the image:

```dockerfile
# Dockerfile with Python MCP support
FROM alpine:latest

# Install Python and dependencies for MCP servers
RUN apk update && apk add --no-cache \
    ca-certificates \
    curl \
    python3 \
    python3-dev \
    py3-pip \
    build-base \
    libffi-dev \
    openssl-dev \
    && python3 -m pip install --upgrade pip --break-system-packages

# Install uv (which provides uvx) globally
RUN python3 -m pip install uv --break-system-packages

# Download and install Gola binary
RUN curl -L https://github.com/gola-agent/gola/releases/latest/download/gola-linux-amd64 \
    -o /usr/local/bin/gola && \
    chmod +x /usr/local/bin/gola

# Create app directory
WORKDIR /app
COPY gola.yaml ./
COPY prompts/ ./prompts/

# Create non-root user
RUN adduser -D -s /bin/sh -h /app gola && \
    chown -R gola:gola /app

USER gola

EXPOSE 3001

CMD ["gola", "--config", "gola.yaml", "--server-only", "--bind-addr", "0.0.0.0:3001"]
```

### Docker with Auto-Download

Let Gola download Python/Node as needed:

```dockerfile
# Dockerfile for embedded runtime auto-download
FROM alpine:latest

# Install dependencies needed for runtime downloads
RUN apk update && apk add --no-cache \
    curl \
    ca-certificates \
    tar \
    gzip \
    bash \
    unzip

# Download and install Gola binary
RUN curl -L https://github.com/gola-agent/gola/releases/latest/download/gola-linux-amd64 \
    -o /usr/local/bin/gola && \
    chmod +x /usr/local/bin/gola

# Create app directory
WORKDIR /app
COPY gola.yaml ./
COPY prompts/ ./prompts/

# Create non-root user
RUN adduser -D -s /bin/sh -h /app gola && \
    chown -R gola:gola /app

USER gola

EXPOSE 3001

# Gola will auto-download Python/Node.js as needed
CMD ["gola", "--config", "gola.yaml", "--server-only", "--bind-addr", "0.0.0.0:3001"]
```

### Build and Run

```bash
# Build image
docker build -t my-gola-agent .

# Run container
docker run -d \
  --name my-gola-agent \
  -p 3001:3001 \
  -e OPENAI_API_KEY="${OPENAI_API_KEY}" \
  -e ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}" \
  -e GOOGLE_API_KEY="${GOOGLE_API_KEY}" \
  my-gola-agent

# Check logs
docker logs my-gola-agent

# Stop container
docker stop my-gola-agent
```

### Docker Compose

When you need more than just the agent:

```yaml
# docker-compose.yml
version: '3.8'

services:
  gola:
    build: .
    ports:
      - "3001:3001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - RUST_LOG=info
    volumes:
      - ./gola.yaml:/app/gola.yaml:ro
      - ./prompts:/app/prompts:ro
    restart: unless-stopped
```

Run with Docker Compose:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Which Deployment Should You Use?

**Minimal Alpine Docker** (~20MB)
- You're not using MCP servers
- You want the smallest possible image
- Perfect for simple chat agents

**Docker with MCP** (~150MB)
- You're using Python MCP servers
- You know exactly what tools you need
- Good for stable production setups

**Auto-Download Docker** (~25MB, grows to ~200MB)
- You want flexibility
- First-run penalty is acceptable
- Great for development and testing

**Direct Binary + Systemd**
- You don't like Docker
- You're on a traditional Linux server
- You want direct control

**Pro-tip**: Start with auto-download for development, switch to minimal or MCP-specific for production. The smaller the image, the faster your deploys.

## Security Notes

- Never hardcode API keys in Dockerfiles
- Use `--read-only` flag when possible
- Run as non-root user (all examples do this)
- Limit container capabilities with `--cap-drop ALL`
- Use secrets management in production (Kubernetes secrets, HashiCorp Vault, etc.)

Remember: These agents can call external tools. Lock down what they can access.