import { EvmChain } from '../../vendored/daydreams/src/core/v1/chains/evm';
import type { EvmChainConfig } from '../../vendored/daydreams/src/core/v1/chains/evm';
import type { IChain } from '../../vendored/daydreams/src/core/v1/types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Creates and returns a Story chain client
 * 
 * @returns An initialized Story chain client implementing the IChain interface
 * 
 * @example
 * ```typescript
 * // Using default configuration from .env
 * const storyClient = createStoryClient();
 * ```
 */
export function createStoryClient(): IChain {
  // Validate environment variables
  if (!process.env.STORY_RPC_URL) {
    throw new Error('STORY_RPC_URL is not defined in .env');
  }
  
  if (!process.env.AGENT_PRIVATE_KEY) {
    throw new Error('AGENT_PRIVATE_KEY is not defined in .env');
  }
  
  // Create EVM chain configuration
  const evmConfig: EvmChainConfig = {
    chainName: 'story-aeneid-testnet',
    rpcUrl: process.env.STORY_RPC_URL,
    privateKey: process.env.AGENT_PRIVATE_KEY,
    chainId: 1315,
  };
  
  // Create and return the Story client
  return new EvmChain(evmConfig);
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
