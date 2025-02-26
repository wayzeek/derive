# Derive - Music Metadata Processing System

A system for processing music metadata and registering intellectual property (IP) assets on Story Protocol.

## Overview

Derive is a specialized system that:
1. Processes and validates music metadata according to a standardized schema
2. Transforms metadata from different formats to a standard format
3. Registers intellectual property assets on Story Protocol
4. Provides real-time progress updates via WebSockets

## Architecture

The system consists of two main components:

1. **Backend Server** (`src/backend/server.ts`) - Handles HTTP and WebSocket connections, processes metadata, and communicates with the agent
2. **Agent** (`src/agent.ts`) - Processes metadata requests, validates against the schema, and registers IP on Story Protocol

## Features

- **Real-time Updates**: WebSocket-based progress updates during processing
- **Metadata Validation**: Validates incoming metadata against a standardized schema
- **Format Transformation**: Transforms metadata from different formats to the standard format
- **IP Registration**: Registers validated metadata as IP assets on Story Protocol
- **Persistent Storage**: Saves processed metadata and registration details

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2.3 or higher
- A Google API key for AI processing
- Story Protocol credentials
- Pinata JWT for IPFS storage

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required environment variables:
   - `AGENT_PRIVATE_KEY` - Private key for the agent
   - `AGENT_ADDRESS` - Address for the agent
   - `STORY_RPC_URL` - Story Protocol RPC URL
   - `PINATA_JWT` - Pinata JWT for IPFS storage
   - `GOOGLE_API_KEY` - Google API key for AI processing

### Installation

```bash
bun install
```

### Running the System

1. Start the backend server:
   ```bash
   bun run src/backend/server.ts
   ```

2. Start the agent:
   ```bash
   bun run src/agent.ts
   ```

## Usage

### Sending Metadata

You can send metadata to the system using a POST request:

```bash
curl -X POST -H "Content-Type: application/json" -d @src/samples/perfect-metadata.json http://localhost:3000/metadata
```

### WebSocket Connection

Connect to the WebSocket endpoint to receive real-time updates:

```
ws://localhost:3000/ws?requestId={requestId}
```

The `requestId` is returned in the response from the `/metadata` endpoint.

## Sample Files

The system includes several sample metadata files for testing:

- `src/samples/perfect-metadata.json` - Complete metadata in the correct format
- `src/samples/missing-data-metadata.json` - Metadata with missing required fields
- `src/samples/different-format-metadata.json` - Metadata in a different format that needs transformation

## Metadata Schema

The system uses a standardized metadata schema for music assets. See `METADATA.md` for the complete schema documentation.

## Output Files

After processing, the system generates:

- `src/samples/processed-metadata.json` - The processed metadata
- `src/samples/ip-registration.json` - Details of the IP registration on Story Protocol

## Project Structure

- `src/agent.ts` - Main agent implementation
- `src/backend/server.ts` - Backend server implementation
- `src/samples/` - Sample metadata files and outputs
- `src/actions/` - Agent actions
- `src/contexts/` - Context definitions
- `src/extensions/` - System extensions
- `src/utils/` - Utility functions