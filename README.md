# Derive

Derive is an AI agent framework built on the DaydreamsAI platform. It uses a goal-oriented approach to manage and execute tasks through a structured planning system.

## Features

- **Goal Management**: Hierarchical goal planning with long-term, medium-term, and short-term goals
- **Task Execution**: Structured task execution with clear success criteria
- **CLI Interface**: Interactive command-line interface for interacting with the agent
- **Google Gemini Integration**: Powered by Google's Gemini 2.0 Flash model

## Prerequisites

- [Bun](https://bun.sh) v1.2.3 or higher
- A Google API key for Gemini access
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for running ChromaDB and MongoDB

## Setup

1. Clone the repository
2. Create a `.env` file with your Google API key and compose project name:
   ```
   GOOGLE_API_KEY=your_api_key_here
   COMPOSE_PROJECT_NAME=derive
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the required services using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This will start:
   - ChromaDB on port 8000 (for vector storage)
   - MongoDB on port 27017

## Running the Agent

Start the agent with:

```bash
bun run src/agent.ts
```

## Project Structure

- `src/agent.ts` - Main agent configuration and initialization
- `src/contexts/` - Context definitions for agent memory and state
- `src/actions/` - Action definitions that the agent can perform
- `src/outputs/` - Output handlers for agent responses
- `src/extensions/` - Extensions including the CLI interface

## Development

This project was created using `bun init` in bun v1.2.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
