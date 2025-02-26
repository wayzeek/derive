import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

// Load environment variables
dotenv.config();

// Define response type
export interface MetadataResponse {
  timestamp: number;
  success: boolean;
  metadata: Record<string, any> | null;
  message: string;
  requestId?: string;
  agentResponse?: string;
  processedMetadata?: Record<string, any> | null;
  missingFields?: string[];
  status?: 'VALID' | 'REFORMATTED' | 'INCOMPLETE';
  ipRegistration?: {
    ipId: string;
    transactionHash: string;
    success: boolean;
    message: string;
    metadata?: {
      ipMetadataURI: string;
      nftMetadataURI: string;
    };
  } | null;
  progress?: {
    step: string;
    message: string;
    percentage: number;
  };
}

// WebSocket client interface with requestId
interface WebSocketClient extends WebSocket {
  requestId?: string;
  isAlive?: boolean;
}

// Server configuration
const PORT = process.env.PORT || 3000;
const AGENT_PORT = process.env.AGENT_PORT || 3001;

// Store pending requests waiting for agent responses
const pendingRequests: Map<string, express.Response> = new Map();
// Store WebSocket clients for streaming updates
const wsClients: Map<string, WebSocketClient> = new Map();

// Metadata schema information to inject into the prompt
const metadataSchemaInfo = `
# Music Metadata Schema Information

## Standard Metadata Format:
- release: Contains all release information
  - title: Title of the release
  - type: Type of release (album, single, EP)
  - upc: UPC/EAN identifier
  - catalogNumber: Catalog number
  - releaseDate: Release date (YYYY-MM-DD)
  - label: Information about the label
    - name: Name of the label
    - id: Unique identifier for the label
  - genre: Array of genres
  - territories: Array of territories
  - distributionPlatforms: Array of distribution platforms
  - tracks: Array of tracks
    - position: Position of the track in the release
    - title: Title of the track
    - duration: Duration of the track (e.g., '3:45')
    - isrc: ISRC identifier
    - explicit: Whether the track contains explicit content
    - language: Language of the track
    - composition: Contains composition information
      - title: Title of the composition
      - iswc: ISWC identifier
      - writers: Array of songwriters
      - rights: Rights information
    - recording: Contains recording information
      - performers: Array of performers
      - producers: Array of producers
      - masterOwner: Information about the master owner
      - rights: Rights information
- submitter: Information about the submitter
  - name: Name of the submitter
  - role: Role of the submitter
  - walletAddress: Wallet address of the submitter
  - email: Email of the submitter
  - timestamp: Timestamp of submission
  - signature: Signature of the submitter

## Complete Workflow:
1. Format and validate the metadata:
   - Validate incoming metadata against the standard schema
   - Identify missing required fields
   - Transform metadata from different formats to the standard format
   - Ensure all rights information is properly formatted
   - Verify that percentage splits add up to 100% for each category
   - Check that all required identifiers (ISRC, ISWC, UPC) are in the correct format
   - Ensure all dates are in ISO format (YYYY-MM-DD)

2. Register the IP asset on Story Protocol:
   - Use the formatted metadata to create IP metadata
   - Create NFT metadata based on the release information
   - Upload both metadata types to IPFS
   - Mint and register the IP asset on Story Protocol
   - Capture the transaction hash and IP ID from the registration

3. Return a complete response with:
   - The formatted metadata
   - Registration status (success or failure)
   - Transaction hash from the blockchain
   - IP ID from Story Protocol
   - Any error messages if the process failed

## Expected Workflow:
1. If the metadata is already in the correct format with all required fields, use it directly for IP registration
2. If the metadata contains all required information but is not in the correct format, reformat it first
3. If required information is missing, return the metadata with status 'INCOMPLETE' and a list of missing fields
4. After successful formatting, proceed to register the IP asset on Story Protocol
5. Return the complete results including transaction details

## Response Format:
Your response should include:
1. A brief summary of what you found and what actions were taken
2. The status of the metadata: 'VALID', 'REFORMATTED', or 'INCOMPLETE'
3. If status is 'INCOMPLETE', a list of missing fields that need to be provided
4. If IP registration was attempted, the transaction hash and IP ID
5. The processed metadata in a JSON code block
`;

// Helper function to send WebSocket updates to clients
function sendWSUpdate(requestId: string, data: any) {
  if (wsClients.has(requestId)) {
    const client = wsClients.get(requestId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      console.log(chalk.blue(`📤 Sent WebSocket update for request ${requestId}`));
    }
  }
}

/**
 * Creates and starts the metadata server
 */
function startServer() {
  // Create Express app
  const app = express();
  
  // Create HTTP server
  const server = http.createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server });
  
  // Enable CORS
  app.use(cors());
  
  // Middleware to parse JSON bodies
  app.use(bodyParser.json({ limit: '10mb' }));
  
  // Set up WebSocket connection handling
  wss.on('connection', (ws: WebSocketClient, req) => {
    // Extract requestId from URL
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const requestId = url.searchParams.get('requestId');
    
    if (!requestId) {
      console.log(chalk.yellow('⚠️ WebSocket connection attempt without requestId'));
      ws.close(1008, 'Missing requestId parameter');
      return;
    }
    
    console.log(chalk.blue(`\n🔄 Client connected via WebSocket for request ID: ${requestId}`));
    
    // Store requestId with the WebSocket client
    ws.requestId = requestId;
    ws.isAlive = true;
    
    // Store the WebSocket client for later updates
    wsClients.set(requestId, ws);
    
    // Send initial connection message
    ws.send(JSON.stringify({ 
      type: 'connected', 
      requestId, 
      timestamp: Date.now() 
    }));
    
    // Handle pings to keep connection alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    
    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(chalk.blue(`\n📥 Received WebSocket message from client for request ID: ${requestId}`), data);
        
        // Handle different message types here if needed
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error(chalk.red('❌ Error parsing WebSocket message:'), error);
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log(chalk.yellow(`\n🔄 Client disconnected from WebSocket for request ID: ${requestId}`));
      wsClients.delete(requestId);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error(chalk.red(`❌ WebSocket error for request ID: ${requestId}:`), error);
      wsClients.delete(requestId);
    });
  });
  
  // Set up a heartbeat interval to check for dead connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: WebSocketClient) => {
      if (ws.isAlive === false) {
        if (ws.requestId) {
          wsClients.delete(ws.requestId);
        }
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000); // Check every 30 seconds
  
  // Clean up the interval when the server closes
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });
  
  // Set up the metadata endpoint
  app.post('/metadata', async (req: express.Request, res: express.Response) => {
    console.log(chalk.blue('\n🔄 Received metadata from client'));
    
    try {
      const metadata = req.body;
      
      // Generate a unique request ID
      const requestId = uuidv4();
      
      // Store the response object to be completed when the agent responds
      pendingRequests.set(requestId, res);
      
      // Set a timeout to handle cases where the agent doesn't respond
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          console.log(chalk.yellow(`⚠️ No agent response received for request ${requestId} after 60 seconds`));
          
          // Send a timeout response to the client
          pendingRequests.get(requestId)?.json({
            timestamp: Date.now(),
            success: false,
            metadata: metadata,
            message: 'Agent processing timed out. Please try again later.',
            requestId
          });
          pendingRequests.delete(requestId);
        }
      }, 60000); // 60 second timeout
      
      // Forward the metadata to the agent
      try {
        await axios.post(`http://localhost:${AGENT_PORT}/agent-metadata`, {
          metadata: metadata,
          requestId,
          message: `You are a metadata processing and IP registration expert. Your task is to process the provided music metadata according to the schema and rules below, then register it as an IP asset on Story Protocol. ${metadataSchemaInfo}`
        });
        console.log(chalk.green(`✅ Metadata forwarded to agent with request ID: ${requestId}`));
        console.log(chalk.yellow('⏳ Waiting for agent response...'));
        
        // Return the requestId to the client so they can connect via WebSocket
        res.json({ 
          success: true, 
          message: 'Metadata received and processing started',
          requestId,
          wsEndpoint: `ws://localhost:${PORT}/ws?requestId=${requestId}`
        });
        
        // Remove from pending requests since we've already responded
        pendingRequests.delete(requestId);
      } catch (error) {
        console.error(chalk.red('❌ Failed to forward metadata to agent:'), error);
        
        // If we can't reach the agent, respond to the client directly
        pendingRequests.delete(requestId);
        res.status(500).json({ 
          timestamp: Date.now(),
          success: false,
          metadata: metadata,
          message: 'Failed to forward metadata to agent. Is the agent running?',
          requestId
        });
      }
    } catch (error) {
      console.error('Error processing metadata:', error);
      res.status(500).json({ 
        timestamp: Date.now(),
        success: false,
        metadata: null,
        message: 'Failed to process metadata'
      });
    }
  });
  
  // Endpoint to receive responses from the agent
  app.post('/agent-response', (req, res) => {
    const { requestId, agentResponse, transformedMetadata, missingFields, status, ipRegistration, progress } = req.body;
    
    console.log(chalk.blue(`\n📥 Received agent response for request ID: ${requestId}`));
    
    // If this is a progress update, send it to the client via WebSocket and return
    if (progress) {
      console.log(chalk.cyan(`\n🔄 Progress update: ${progress.step} - ${progress.percentage}%`));
      sendWSUpdate(requestId, {
        type: 'progress',
        requestId,
        timestamp: Date.now(),
        progress
      });
      
      // Acknowledge receipt to the agent
      return res.json({ success: true });
    }
    
    // Create the final response with the agent's answer
    const response: MetadataResponse = {
      timestamp: Date.now(),
      success: true,
      metadata: req.body.originalMetadata || null,
      message: 'Metadata processed successfully',
      agentResponse,
      processedMetadata: transformedMetadata,
      missingFields: missingFields || [],
      status: status || 'VALID',
      ipRegistration: ipRegistration || null
    };
    
    // Send the final update via WebSocket if there's a client connected
    sendWSUpdate(requestId, {
      type: 'complete',
      requestId,
      timestamp: Date.now(),
      response
    });
    
    // If we have transformed metadata, save it to a file
    if (transformedMetadata) {
      const outputPath = path.join(process.cwd(), 'src', 'samples', 'processed-metadata.json');
      fs.writeFileSync(outputPath, JSON.stringify(transformedMetadata, null, 2));
      console.log(chalk.green(`📝 Processed metadata saved to: ${outputPath}`));
      
      // Log a summary of the processed metadata
      console.log(chalk.cyan('\n📋 Processed Metadata Summary:'));
      if (transformedMetadata.release && transformedMetadata.submitter) {
        console.log(chalk.cyan(`Title: ${transformedMetadata.release.title || 'N/A'}`));
        console.log(chalk.cyan(`Type: ${transformedMetadata.release.type || 'N/A'}`));
        console.log(chalk.cyan(`Tracks: ${transformedMetadata.release.tracks?.length || 0}`));
        console.log(chalk.cyan(`Submitter: ${transformedMetadata.submitter.name || 'N/A'}`));
        console.log(chalk.cyan(`Status: ${status || 'N/A'}`));
        
        if (status === 'INCOMPLETE' && missingFields && missingFields.length > 0) {
          console.log(chalk.yellow(`⚠️ Missing fields: ${missingFields.join(', ')}`));
        }
        
        // Log IP registration details if available
        if (ipRegistration) {
          console.log(chalk.green('\n🔗 IP Registration Details:'));
          console.log(chalk.green(`IP ID: ${ipRegistration.ipId || 'N/A'}`));
          console.log(chalk.green(`Transaction Hash: ${ipRegistration.transactionHash || 'N/A'}`));
          console.log(chalk.green(`Status: ${ipRegistration.success ? 'Success' : 'Failed'}`));
          
          // Save IP registration details to a file
          const registrationPath = path.join(process.cwd(), 'src', 'samples', 'ip-registration.json');
          fs.writeFileSync(registrationPath, JSON.stringify(ipRegistration, null, 2));
          console.log(chalk.green(`📝 IP registration details saved to: ${registrationPath}`));
        }
      } else {
        console.log(chalk.yellow('⚠️ Processed metadata is not in the expected format'));
      }
    } else {
      console.log(chalk.yellow('⚠️ No processed metadata received from agent'));
    }
    
    // Acknowledge receipt to the agent
    res.json({ success: true });
  });

  // Serve static files from the samples directory
  app.use('/samples', express.static(path.join(process.cwd(), 'src', 'samples')));

  // Start the server
  server.listen(PORT, () => {
    console.log(chalk.green(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║  ${chalk.bold('Metadata Processing Server')}                        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
`));
    console.log(chalk.cyan(`Server is running on port ${PORT}`));
    console.log(chalk.yellow('Waiting to receive metadata...'));
    console.log(chalk.gray('\nTo send metadata, use another terminal and run:'));
    console.log(chalk.gray(`curl -X POST -H "Content-Type: application/json" -d @src/samples/sample-metadata.json http://localhost:${PORT}/metadata`));
    console.log(chalk.gray('\nTo connect via WebSocket:'));
    console.log(chalk.gray(`ws://localhost:${PORT}/ws?requestId={requestId}`));
    console.log(chalk.gray('\nMake sure the agent is running on port ' + AGENT_PORT));
  });
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
} 