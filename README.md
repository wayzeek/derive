# Derive - Metadata Processing System

This system processes music metadata through a separate backend server and agent.

## Architecture

The system consists of two main components:

1. **Backend Server** - Handles metadata validation and processing
2. **Agent** - Receives processed metadata and interacts with users

## How to Use

### Step 1: Start the Backend Server (Terminal 1)

```bash
bun run src/start-server.ts
```

This will start the metadata processing server on port 3000.

### Step 2: Start the Agent (Terminal 2)

```bash
bun run src/agent.ts
```

This will start the agent on port 3001, which will display the CLI interface.

### Step 3: Send Metadata (Terminal 3)

Use curl to send metadata to the backend server:

```bash
curl -X POST -H "Content-Type: application/json" -d @src/samples/sample-metadata.json http://localhost:3000/metadata
```

### Step 4: View Results

The processed metadata will be displayed in the agent terminal (Terminal 2).

## Sample Files

- `src/samples/sample-metadata.json` - Complete metadata example
- `src/samples/incomplete-metadata.json` - Incomplete metadata example for testing validation

## Testing

You can run the test workflow script to test the entire system:

```bash
bash src/samples/test-workflow.sh
```

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

## Project Structure

- `src/agent.ts` - Main agent configuration and initialization
- `src/contexts/`