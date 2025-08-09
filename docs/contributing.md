# Contributing to Gola

Thank you for your interest in contributing to Gola! Contributions of all kinds are welcome - code, documentation, examples, and bug reports.

## Development Setup

### Prerequisites

- **Rust**: 1.75 or later
- **Git**: For cloning the repository
- **System dependencies**: 
  - OpenSSL development libraries
  - pkg-config (Linux/macOS)

### Clone and Build

```bash
# Clone the repository
git clone https://github.com/gola-agent/gola
cd gola

# Build the project
cargo build --release

# Run tests
cargo test

# The binary will be at target/release/gola
```

### Project Structure

Gola uses a Cargo workspace with multiple crates:

```
gola/
├── crates/
│   ├── gola-core/        # Core agent orchestration, LLM providers, MCP integration
│   ├── gola-term/        # Terminal interface and user interaction
│   └── gola-ag-ui-server/# Agent UI server component
├── examples/             # Example agent configurations
└── docs/                # Documentation
```

## Building & Testing

### Build Commands

```bash
# Development build (faster compilation, debugging symbols)
cargo build

# Release build (optimized)
cargo build --release

# Build specific crate
cargo build -p gola-core

# Check compilation without building
cargo check
```

### Running Tests

```bash
# Run all tests
cargo test

# Run tests for specific crate
cargo test -p gola-core

# Run tests with output
cargo test -- --nocapture

# Run specific test
cargo test test_name
```

### Code Quality

Before submitting PRs, ensure code quality:

```bash
# Format code
cargo fmt

# Run linter
cargo clippy -- -D warnings

# Check for security vulnerabilities
cargo audit
```

## Development Workflow

### 1. Fork and Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/gola
cd gola
git remote add upstream https://github.com/gola-agent/gola
```

### 2. Create a Branch

Create a feature branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Changes

- Write clear, documented code
- Follow existing code patterns and conventions
- Add tests for new functionality
- Update documentation if needed

### 4. Commit Messages

Use clear, descriptive commit messages:

```
feat: Add support for Gemini 2.5 Flash model
fix: Resolve infinite loop in state machine
docs: Update MCP integration examples
test: Add tests for tracing module
```

### 5. Test Your Changes

```bash
# Run tests
cargo test

# Test with an example agent
./target/release/gola --config examples/minimal/gola.yaml
```

## Submitting Changes

### Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**:
   - Go to GitHub and create a PR from your branch
   - Fill in the PR template with:
     - Description of changes
     - Related issue numbers
     - Testing performed
     - Breaking changes (if any)

4. **PR Requirements**:
   - All tests must pass
   - Code must be formatted (`cargo fmt`)
   - No clippy warnings
   - Documentation updated if needed
   - Clear PR description

### Code Review

- PRs require at least one review
- Address feedback constructively
- Keep PRs focused - one feature/fix per PR
- Be patient - reviews take time

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and ideas
- **Pull Requests**: Code contributions

### Before Asking

1. Check existing issues and discussions
2. Review the documentation
3. Search closed issues for similar problems

### When Creating Issues

Use the issue templates and provide:
- Clear description of the problem/feature
- Steps to reproduce (for bugs)
- Environment details (OS, Rust version)
- Example configurations or code

## License

By contributing to Gola, you agree that your contributions will be licensed under the MIT License.