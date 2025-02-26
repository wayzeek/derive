import { StoryClient } from '@story-protocol/core-sdk';
import type { StoryConfig } from '@story-protocol/core-sdk';
import { http, zeroAddress } from 'viem';
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


// Create a new SPG NFT collection
//
// NOTE: Use this code to create a new SPG NFT collection. You can then use the
// `newCollection.spgNftContract` address as the `spgNftContract` argument in
// functions like `mintAndRegisterIpAssetWithPilTerms` in the
// `simpleMintAndRegisterSpg.ts` file.
//
// You will mostly only have to do this once. Once you get your nft contract address,
// you can use it in SPG functions.
//
export async function createSPGCollection() {
  const client = createStoryClient();
  const newCollection = await client.nftClient.createNFTCollection({
    name: 'Derive Protocol',
    symbol: 'DERIVE',
  isPublicMinting: true,
  mintOpen: true,
  mintFeeRecipient: zeroAddress,
    contractURI: '',
    txOptions: { waitForTransaction: true },
  })

  console.log(`New SPG NFT collection created at transaction hash ${newCollection.txHash}`)
  console.log(`NFT contract address: ${newCollection.spgNftContract}`)
}