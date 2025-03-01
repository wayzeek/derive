import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../utils/apiService';
import { websocketService, WebSocketMessage, MetadataResponse, ProgressUpdate, IPRegistration } from '../utils/websocketService';

interface UseMetadataSubmissionResult {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isProcessing: boolean;
  requestId: string | null;
  progress: ProgressUpdate | null;
  response: MetadataResponse | null;
  ipRegistration: IPRegistration | null;
  error: Error | null;
  submitMetadata: (formData: any) => Promise<void>;
  resetState: () => void;
}

export const useMetadataSubmission = (): UseMetadataSubmissionResult => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [response, setResponse] = useState<MetadataResponse | null>(null);
  const [ipRegistration, setIpRegistration] = useState<IPRegistration | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 3;
  const [retryCount, setRetryCount] = useState(0);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('Processing WebSocket message in hook:', message);

    if (message.type === 'connected') {
      console.log('WebSocket connected for request ID:', message.requestId);
      setWsConnected(true);
      // Clear any existing connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
    } else if (message.type === 'progress') {
      if (message.progress) {
        console.log('Updating progress:', message.progress);
        setProgress(message.progress);
        setIsProcessing(true);
      }
    } else if (message.type === 'complete') {
      console.log('Processing complete message:', message);
      if (message.response) {
        // Update response first
        setResponse(message.response);
        
        // Then update IP registration if available
        if (message.response.ipRegistration) {
          setIpRegistration(message.response.ipRegistration);
        }
        
        // Finally update status flags
        setIsProcessing(false);
        setIsSubmitted(true);
        
        // Delay cleanup to ensure state updates are processed
        setTimeout(() => {
          websocketService.disconnect();
          setWsConnected(false);
        }, 1000);
      }
    } else if (message.type === 'error') {
      console.error('WebSocket error message:', message.error);
      setError(new Error(message.error || 'Unknown error occurred'));
      setIsProcessing(false);
      
      // Delay cleanup to ensure state updates are processed
      setTimeout(() => {
        websocketService.disconnect();
        setWsConnected(false);
      }, 1000);
    }
  }, []);

  // Connect to WebSocket when requestId changes
  useEffect(() => {
    if (requestId) {
      setIsProcessing(true);
      
      const connectWithRetry = async () => {
        try {
          // Remove any existing handlers first
          websocketService.removeMessageHandler(handleWebSocketMessage);
          
          // Add message handler
          websocketService.addMessageHandler(handleWebSocketMessage);
          
          // Connect to WebSocket
          const connected = await websocketService.connect(requestId);
          
          if (!connected && retryCount < maxRetries) {
            // If connection fails, retry after a delay
            console.log(`Retrying connection... Attempt ${retryCount + 1} of ${maxRetries}`);
            setRetryCount(prev => prev + 1);
            setTimeout(connectWithRetry, 2000); // Retry after 2 seconds
          } else if (!connected) {
            setError(new Error('Failed to connect to WebSocket after multiple attempts'));
            setIsProcessing(false);
            setWsConnected(false);
          }
        } catch (err) {
          console.error('Error in WebSocket connection:', err);
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            setTimeout(connectWithRetry, 2000);
          } else {
            setError(new Error('Failed to connect to WebSocket after multiple attempts'));
            setIsProcessing(false);
            setWsConnected(false);
          }
        }
      };

      connectWithRetry();
      
      // Set a longer timeout for the entire operation
      connectionTimeoutRef.current = setTimeout(() => {
        if (!wsConnected) {
          setError(new Error('Operation timed out. Please try again.'));
          setIsProcessing(false);
          websocketService.disconnect();
        }
      }, 120000); // 2 minute timeout
      
      // Clean up when component unmounts or requestId changes
      return () => {
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
        
        // Only clean up if we're not in the middle of processing or if the component is unmounting
        const isUnmounting = !requestId;
        if (isUnmounting || !isProcessing) {
          websocketService.removeMessageHandler(handleWebSocketMessage);
          websocketService.disconnect();
          setWsConnected(false);
        }
      };
    }
  }, [requestId, handleWebSocketMessage, retryCount, wsConnected, isProcessing]);

  // Submit metadata to the server
  const submitMetadata = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setResponse(null);
      setIpRegistration(null);
      setProgress(null);
      setWsConnected(false);
      setRetryCount(0);
      
      // Format the metadata
      const metadata = apiService.formatMetadataFromForm(formData);
      
      console.log('Submitting metadata:', metadata);
      
      // Submit the metadata
      const result = await apiService.submitMetadata(metadata);
      console.log('Submission result:', result);
      
      if (!result.requestId) {
        throw new Error('No request ID received from server');
      }
      
      // Set the request ID
      setRequestId(result.requestId);
      setIsSubmitting(false);
      
    } catch (err) {
      console.error('Error in submitMetadata:', err);
      setIsSubmitting(false);
      setIsProcessing(false);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  };

  // Reset the state
  const resetState = useCallback(() => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setIsProcessing(false);
    setRequestId(null);
    setProgress(null);
    setResponse(null);
    setIpRegistration(null);
    setError(null);
    setWsConnected(false);
    setRetryCount(0);
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    
    // Only disconnect if we're not in the middle of processing
    if (!isProcessing) {
      websocketService.disconnect();
    }
  }, [isProcessing]);

  return {
    isSubmitting,
    isSubmitted,
    isProcessing,
    requestId,
    progress,
    response,
    ipRegistration,
    error,
    submitMetadata,
    resetState,
  };
}; 