# Derive

<p align="center">
  <img src="derive.png" alt="Derive Logo" width="120" height="120" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version" />
</p>

<p align="center">
  <i>Bridging music distributors and Story Protocol to create a unified source of truth for music rights and ownership</i>
</p>

## 📖 Overview

Derive is a specialized system that addresses critical challenges in music metadata management by:

- Processing and validating music metadata according to a standardized schema
- Transforming metadata from different formats to a standard format
- Registering intellectual property assets on Story Protocol
- Providing real-time progress updates via WebSockets

The system creates a single source of truth for music rights and ownership, solving key industry pain points:
- Lack of standardization across metadata formats
- Poor linking between related assets (compositions, recordings, releases)
- Missing or incorrect ownership data
- Challenges with scale and volume of new music releases

## 🏗️ Architecture

The system consists of three main components:

1. **Backend Server** (`src/backend/server.ts`) - Handles HTTP and WebSocket connections, processes metadata, and communicates with the agent
2. **Agent** (`src/agent.ts`) - Processes metadata requests, validates against the schema, and registers IP on Story Protocol
3. **Frontend** (`frontend/`) - Provides a user interface for submitting metadata and viewing processing status

### System Flow

1. Music metadata is submitted via the API or frontend
2. The backend server processes the request and forwards it to the agent
3. The agent validates the metadata, transforms it if needed, and registers it on Story Protocol
4. Real-time updates are sent to the client via WebSockets
5. Processed metadata and registration details are stored for future reference

## ✨ Features

- **Real-time Updates**: WebSocket-based progress updates during processing
- **Metadata Validation**: Validates incoming metadata against a standardized schema
- **Format Transformation**: Transforms metadata from different formats to the standard format
- **IP Registration**: Registers validated metadata as IP assets on Story Protocol
- **Persistent Storage**: Saves processed metadata and registration details
- **Modern UI**: Clean, responsive interface for metadata submission and tracking

## 🚀 Getting Started

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
   - `GOOGLE_API_KEY` - Google API key for AI processing
   - `AGENT_PRIVATE_KEY` - Private key for the agent
   - `AGENT_ADDRESS` - Address for the agent
   - `STORY_RPC_URL` - Story Protocol RPC URL
   - `PINATA_JWT` - Pinata JWT for IPFS storage

### Installation

1. Install backend dependencies:
   ```bash
   bun install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   bun install
   ```

### Running the System

1. Start the backend server and agent:
   ```bash
   bun run start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   bun run dev
   ```

## 📊 Usage

### API Endpoints

#### Submit Metadata

```
POST /metadata
```

Request body: JSON metadata following the schema defined in [METADATA.md](METADATA.md)

Response:
```json
{
  "timestamp": 1677456789,
  "success": true,
  "message": "Metadata received and processing started",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### WebSocket Connection

Connect to the WebSocket endpoint to receive real-time updates:

```
ws://localhost:3000/ws?requestId={requestId}
```

The `requestId` is returned in the response from the `/metadata` endpoint.

### Sample Files

The system includes several sample metadata files for testing:

- `samples/perfect-metadata.json` - Complete metadata in the correct format
- `samples/missing-data-metadata.json` - Metadata with missing required fields
- `samples/different-format-metadata.json` - Metadata in a different format that needs transformation

## 📝 Metadata Schema

The system uses a standardized metadata schema for music assets. See [METADATA.md](METADATA.md) for the complete schema documentation.

## 📁 Project Structure

```
derive/
├── .env.example          # Example environment variables
├── .env                  # Environment variables (not in repo)
├── METADATA.md           # Metadata schema documentation
├── README.md             # This file
├── package.json          # Project dependencies and scripts
├── samples/              # Sample metadata files
│   └── registrations/    # Sample IP registration results
├── outputs/              # Processed metadata and registration outputs
├── src/
│   ├── agent.ts          # Main agent implementation
│   ├── actions/          # Agent actions
│   ├── backend/          # Backend server implementation
│   │   └── server.ts     # Express server with WebSocket support
│   ├── contexts/         # Context definitions
│   ├── extensions/       # System extensions
│   ├── outputs/          # Output handlers
│   └── utils/            # Utility functions
├── tests/                # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
└── frontend/             # Frontend React application
    ├── src/              # Frontend source code
    ├── public/           # Static assets
    └── package.json      # Frontend dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.