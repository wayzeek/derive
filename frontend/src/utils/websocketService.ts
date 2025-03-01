// WebSocket service for handling real-time updates from the server
export interface WebSocketMessage {
  type: string;
  requestId: string;
  timestamp: number;
  [key: string]: any;
}

export interface ProgressUpdate {
  step: string;
  message: string;
  percentage: number;
}

export interface IPRegistration {
  ipId: string;
  transactionHash: string;
  success: boolean;
  message: string;
  metadata?: {
    ipMetadataURI: string;
    nftMetadataURI: string;
  };
}

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
  ipRegistration?: IPRegistration | null;
  progress?: ProgressUpdate;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private currentRequestId: string | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private isReconnecting = false;

  // Connect to the WebSocket server
  connect(requestId: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Store the current request ID
        this.currentRequestId = requestId;

        // Close existing connection if any
        this.disconnect();

        // Create a new WebSocket connection
        const wsUrl = `ws://${window.location.hostname}:3000/ws?requestId=${requestId}`;
        console.log('Connecting to WebSocket:', wsUrl);
        
        this.socket = new WebSocket(wsUrl);

        // Set connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (this.socket?.readyState !== WebSocket.OPEN) {
            console.log('WebSocket connection timeout');
            this.socket?.close();
            resolve(false);
          }
        }, 10000); // 10 second connection timeout

        // Set up event handlers
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          this.startPingInterval();
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            console.log('Received WebSocket message:', message);
            
            // Special handling for ping/pong messages
            if (message.type === 'ping' || message.type === 'pong') {
              return;
            }
            
            // Validate message structure
            if (!message.type) {
              console.error('Invalid message format:', message);
              return;
            }
            
            // For non-ping/pong messages, validate requestId
            if (message.type !== 'ping' && message.type !== 'pong' && !message.requestId) {
              console.error('Missing requestId in message:', message);
              return;
            }
            
            // Only validate requestId for messages that should have one
            if (message.requestId && message.requestId !== this.currentRequestId) {
              console.warn('Received message for different request ID. Current:', this.currentRequestId, 'Received:', message.requestId);
              // Don't return here, still process the message as it might be relevant
            }
            
            this.notifyHandlers(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.stopPingInterval();
          
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          
          // Only attempt reconnect if this is still the current request and not a manual disconnect
          if (this.currentRequestId === requestId && !this.isReconnecting && event.code !== 1000) {
            this.attemptReconnect(requestId);
          }
          resolve(false);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
          }
          // Notify handlers of the error
          this.notifyHandlers({
            type: 'error',
            requestId: this.currentRequestId || '',
            timestamp: Date.now(),
            error: 'WebSocket connection error'
          });
          resolve(false);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        resolve(false);
      }
    });
  }

  // Start sending ping messages to keep the connection alive
  private startPingInterval(): void {
    this.stopPingInterval();
    
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  // Stop the ping interval
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Attempt to reconnect to the WebSocket server
  private attemptReconnect(requestId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isReconnecting) {
      this.isReconnecting = true;
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(async () => {
        const connected = await this.connect(requestId);
        if (!connected) {
          this.isReconnecting = false;
        }
      }, delay);
    } else {
      console.log('Maximum reconnect attempts reached');
      this.notifyHandlers({
        type: 'error',
        requestId,
        timestamp: Date.now(),
        error: 'Failed to establish WebSocket connection after maximum attempts'
      });
    }
  }

  // Add a message handler
  addMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  // Remove a message handler
  removeMessageHandler(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  // Notify all handlers of a new message
  private notifyHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in WebSocket message handler:', error);
      }
    });
  }

  // Disconnect from the WebSocket server
  disconnect(): void {
    this.stopPingInterval();
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.socket) {
      // Remove all event listeners
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      
      // Close the connection
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close();
      }
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.reconnectAttempts = 0;
    this.currentRequestId = null;
    this.isReconnecting = false;
  }

  // Check if the WebSocket is connected
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  // Get the current request ID
  getCurrentRequestId(): string | null {
    return this.currentRequestId;
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService(); 