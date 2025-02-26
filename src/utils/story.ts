import { StoryClient } from '@story-protocol/core-sdk';
import type { StoryConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Creates and returns a Story Protocol client
 * 
 * @returns An initialized Story Protocol client
 * 
 * @example
 * ```typescript
 * // Using default configuration from .env
 * const storyClient = createStoryClient();
 * ```
 */
export function createStoryClient(): StoryClient {
  // Validate environment variables
  if (!process.env.STORY_RPC_URL) {
    throw new Error('STORY_RPC_URL is not defined in .env');
  }
  
  if (!process.env.AGENT_PRIVATE_KEY) {
    throw new Error('AGENT_PRIVATE_KEY is not defined in .env');
  }
  
  // Create account from private key
  const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as `0x${string}`);
  
  // Create Story Protocol client configuration
  const config: StoryConfig = {
    transport: http(process.env.STORY_RPC_URL),
    account: account,
  };
  
  // Create and return the Story Protocol client
  return StoryClient.newClient(config);
}

/**
 * Returns the agent's address from the environment variables
 * 
 * @returns The agent's address
 * @throws Error if AGENT_ADDRESS is not defined in .env
 */
export function getAgentAddress(): string {
  if (!process.env.AGENT_ADDRESS) {
    throw new Error('AGENT_ADDRESS is not defined in .env');
  }
  
  return process.env.AGENT_ADDRESS;
}