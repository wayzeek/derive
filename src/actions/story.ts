import { action } from "@daydreamsai/core";
import { getAgentAddress } from "../utils/story";
import { StoryClient } from "@story-protocol/core-sdk";
import type { IpMetadata } from "@story-protocol/core-sdk";
import { z } from "zod";
import type { MusicMetadata } from "./tools";
import type { IPMetadata, NFTMetadata } from "../utils/ipfs";
import { 
  createIPMetadata, 
  createNFTMetadata, 
  uploadMetadataToIPFS 
} from "../utils/ipfs";
import type { ActionCall } from "@daydreamsai/core";
import axios from "axios";

// Define the AgentMetadata interface
interface AgentMetadata {
  getCurrentRequestId?: () => string | null;
  getCurrentMetadata?: () => any;
  setCurrentMetadata?: (metadata: any) => void;
  setSendFunction?: (fn: any) => void;
  getSendFunction?: () => any;
  setMetadataResponseFunction?: (fn: any) => void;
  getMetadataResponseFunction?: () => any;
}

// Helper function to send progress updates
async function sendProgressUpdate(requestId: string, step: string, message: string, percentage: number) {
  try {
    const serverPort = process.env.PORT || 3000;
    await axios.post(`http://localhost:${serverPort}/agent-response`, {
      requestId,
      progress: {
        step,
        message,
        percentage
      }
    });
    console.log(`Progress update sent: ${step} - ${percentage}%`);
  } catch (error) {
    console.error("Error sending progress update:", error);
  }
}

export const storyActions = [
  action({
    name: "registerIPAsset",
    description: "Register a music release as an IP asset on Story Protocol. This action takes processed metadata, creates IP and NFT metadata, uploads it to IPFS, and mints the IP asset on the blockchain. Use this action when you have validated metadata and need to register it on Story Protocol. The action returns the IP ID, transaction hash, and metadata URIs.",
    schema: z.object({
      metadata: z.any().describe("The processed music metadata that contains release and submitter information. This should be in the standard format with all required fields.")
    }),
    async handler(call, ctx, agent) {
      try {
        const metadata = call.data.metadata as MusicMetadata;
        
        // Get the request ID from the agent metadata if available
        const agentMetadata = agent.container.resolve("agentMetadata") as AgentMetadata;
        const requestId = agentMetadata && typeof agentMetadata.getCurrentRequestId === 'function' 
          ? agentMetadata.getCurrentRequestId() || "unknown"
          : "unknown";
        
        // Send initial progress update
        await sendProgressUpdate(requestId, "initialization", "Starting IP asset registration process", 5);
        
        // Get the Story Protocol client
        const storyClient = agent.container.resolve<StoryClient>("storyClient");
        
        if (!storyClient) {
          throw new Error("Story Protocol client not initialized");
        }
        
        // Get the agent's address
        const agentAddress = getAgentAddress();
        
        // Extract relevant information from metadata
        const { release, submitter } = metadata;
        
        // Send progress update
        await sendProgressUpdate(requestId, "metadata_preparation", "Preparing IP metadata", 15);
        
        // Create IP metadata with all available information
        const ipMetadata = createIPMetadata(
          release.title,
          `Music release: ${release.title} (${release.type}). Released on ${release.releaseDate}. UPC: ${release.upc}`,
          [{
            name: submitter.name,
            address: submitter.walletAddress || agentAddress,
            description: submitter.role,
            contributionPercent: 100
          }],
          {
            url: "", // Required field
            type: "music" // Required field
          }
        );
        
        // Send progress update
        await sendProgressUpdate(requestId, "metadata_enrichment", "Enriching metadata with release details", 25);
        
        // Add all additional metadata to ensure complete registration
        const fullIPMetadata = {
          ...ipMetadata,
          // Add release details
          release: {
            title: release.title,
            type: release.type,
            upc: release.upc,
            catalogNumber: release.catalogNumber,
            releaseDate: release.releaseDate,
            label: release.label,
            genre: release.genre,
            territories: release.territories,
            distributionPlatforms: release.distributionPlatforms
          },
          // Add tracks with compositions and recordings
          tracks: release.tracks.map(track => ({
            position: track.position,
            title: track.title,
            duration: track.duration,
            isrc: track.isrc,
            explicit: track.explicit,
            language: track.language,
            // Add composition details
            composition: {
              title: track.composition?.title,
              iswc: track.composition?.iswc,
              writers: track.composition?.writers,
              rights: track.composition?.rights
            },
            // Add recording details
            recording: {
              performers: track.recording?.performers,
              producers: track.recording?.producers,
              masterOwner: track.recording?.masterOwner,
              rights: track.recording?.rights
            }
          })),
          // Add submitter information
          submitter: {
            name: submitter.name,
            role: submitter.role,
            walletAddress: submitter.walletAddress,
            email: submitter.email,
            timestamp: submitter.timestamp
          }
        };
        
        // Send progress update
        await sendProgressUpdate(requestId, "nft_metadata_creation", "Creating NFT metadata", 35);
        
        // Create NFT metadata with enhanced attributes
        const nftMetadata = createNFTMetadata(
          `${release.title} - ${release.type}`,
          `Music release: ${release.title}. UPC: ${release.upc}. Contains ${release.tracks.length} tracks.`,
          undefined, // No image for now
          [
            {
              trait_type: "Release Type",
              value: release.type
            },
            {
              trait_type: "Release Date",
              value: release.releaseDate
            },
            {
              trait_type: "UPC",
              value: release.upc
            },
            {
              trait_type: "Catalog Number",
              value: release.catalogNumber
            },
            {
              trait_type: "Number of Tracks",
              value: release.tracks.length
            },
            {
              trait_type: "Label",
              value: release.label?.name || "Independent"
            },
            {
              trait_type: "Label ID",
              value: release.label?.id || "N/A"
            },
            {
              trait_type: "Genre",
              value: Array.isArray(release.genre) && release.genre.length > 0 ? release.genre.join(", ") : "Unknown"
            },
            {
              trait_type: "Territories",
              value: Array.isArray(release.territories) && release.territories.length > 0 ? release.territories.join(", ") : "WORLDWIDE"
            },
            {
              trait_type: "Distribution Platforms",
              value: Array.isArray(release.distributionPlatforms) && release.distributionPlatforms.length > 0 ? release.distributionPlatforms.join(", ") : "N/A"
            },
            {
              trait_type: "Submitter",
              value: submitter.name
            },
            {
              trait_type: "Submitter Role",
              value: submitter.role
            },
            {
              trait_type: "Submission Date",
              value: submitter.timestamp || new Date().toISOString()
            }
          ]
        );
        
        // Send progress update
        await sendProgressUpdate(requestId, "nft_metadata_enrichment", "Enriching NFT metadata with track details", 45);
        
        // Add complete metadata to NFT metadata to ensure everything is registered
        const enhancedNFTMetadata = {
          ...nftMetadata,
          // Include the complete original metadata
          completeMetadata: metadata,
          // Add detailed track information
          tracks: release.tracks.map(track => ({
            position: track.position,
            title: track.title,
            duration: track.duration,
            isrc: track.isrc,
            explicit: track.explicit,
            language: track.language,
            composition: {
              title: track.composition?.title,
              iswc: track.composition?.iswc,
              writers: track.composition?.writers?.map(writer => ({
                name: writer.name,
                ipi: writer.ipi,
                role: writer.role,
                split: writer.split,
                publisher: writer.publisher ? {
                  name: writer.publisher.name,
                  ipi: writer.publisher.ipi,
                  split: writer.publisher.split
                } : null,
                pro: writer.pro
              })),
              rights: track.composition?.rights
            },
            recording: {
              performers: track.recording?.performers?.map(performer => ({
                name: performer.name,
                isni: performer.isni,
                role: performer.role,
                split: performer.split
              })),
              producers: track.recording?.producers?.map(producer => ({
                name: producer.name,
                role: producer.role,
                split: producer.split
              })),
              masterOwner: track.recording?.masterOwner ? {
                name: track.recording.masterOwner.name,
                percentage: track.recording.masterOwner.percentage
              } : null,
              rights: track.recording?.rights
            },
            storyProtocolMetadata: track.storyProtocolMetadata
          }))
        };
        
        // Send progress update
        await sendProgressUpdate(requestId, "ipfs_upload", "Uploading metadata to IPFS", 55);
        
        // Upload metadata to IPFS
        const { 
          ipMetadataURI, 
          ipMetadataHash, 
          nftMetadataURI, 
          nftMetadataHash 
        } = await uploadMetadataToIPFS(fullIPMetadata, enhancedNFTMetadata);
        
        // Send progress update
        await sendProgressUpdate(requestId, "ipfs_upload_complete", "Metadata uploaded to IPFS successfully", 65);
        
        // Send progress update
        await sendProgressUpdate(requestId, "blockchain_registration", "Registering IP asset on the blockchain", 75);
        
        // Register the IP asset
        const response = await storyClient.ipAsset.mintAndRegisterIp({
          spgNftContract: process.env.STORY_SPG_NFT_CONTRACT as `0x${string}`,
          allowDuplicates: true,
          ipMetadata: {
            ipMetadataURI,
            ipMetadataHash: ipMetadataHash.startsWith('0x') ? ipMetadataHash as `0x${string}` : `0x${ipMetadataHash}` as `0x${string}`,
            nftMetadataURI,
            nftMetadataHash: nftMetadataHash.startsWith('0x') ? nftMetadataHash as `0x${string}` : `0x${nftMetadataHash}` as `0x${string}`,
          },
          txOptions: { waitForTransaction: true },
        });
        
        // Send progress update
        await sendProgressUpdate(requestId, "blockchain_registration_complete", "IP asset registered on the blockchain successfully", 85);
        
        // Store the registration record locally
        try {
          // Send progress update
          await sendProgressUpdate(requestId, "local_storage", "Storing registration record locally", 90);
          
          const fs = require('fs');
          const path = require('path');
          
          // Create a record of the registration
          const registrationRecord = {
            ipId: response.ipId,
            transactionHash: response.txHash,
            metadata: {
              original: metadata,
              ipMetadata: fullIPMetadata,
              nftMetadata: enhancedNFTMetadata,
              ipMetadataURI,
              nftMetadataURI
            },
            timestamp: new Date().toISOString(),
            network: process.env.STORY_NETWORK || "sepolia"
          };
          
          // Create a filename based on the IP ID
          const filename = `ip-${response.ipId?.replace(/0x/g, '')}.json`;
          
          // Save the record to a file in the samples directory
          const dirPath = path.join(process.cwd(), 'src', 'samples', 'registrations');
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          const filePath = path.join(dirPath, filename);
          fs.writeFileSync(filePath, JSON.stringify(registrationRecord, null, 2));
          
          console.log(`Registration record saved to ${filePath}`);
        } catch (error) {
          console.error("Error storing registration record:", error);
          // Continue with the response even if local storage fails
        }
        
        // Send final progress update
        await sendProgressUpdate(requestId, "complete", "IP asset registration process completed successfully", 100);
        
        return {
          success: true,
          message: "IP asset registered successfully",
          ipId: response.ipId,
          transactionHash: response.txHash,
          metadata: {
            ipMetadataURI,
            nftMetadataURI
          },
          registeredData: {
            release: {
              title: release.title,
              type: release.type,
              upc: release.upc,
              trackCount: release.tracks.length
            },
            submitter: {
              name: submitter.name,
              role: submitter.role
            },
            timestamp: new Date().toISOString(),
            network: process.env.STORY_NETWORK || "sepolia"
          }
        };
      } catch (error: any) {
        console.error("Error registering IP asset:", error);
        
        // Get the request ID from the agent metadata if available
        const agentMetadata = agent.container.resolve("agentMetadata") as AgentMetadata;
        const requestId = agentMetadata && typeof agentMetadata.getCurrentRequestId === 'function' 
          ? agentMetadata.getCurrentRequestId() || "unknown"
          : "unknown";
        
        // Send error progress update
        await sendProgressUpdate(requestId, "error", `Error: ${error.message}`, 100);
        
        // Provide more detailed error information
        let errorMessage = `Failed to register IP asset: ${error.message}`;
        
        // Check for specific error types
        if (error.message.includes("bytes")) {
          errorMessage = `Hash format error: ${error.message}. This may be due to incorrect formatting of metadata hashes.`;
        } else if (error.message.includes("contract")) {
          errorMessage = `Contract error: ${error.message}. Please check that the SPG NFT contract address is correct.`;
        } else if (error.message.includes("transaction")) {
          errorMessage = `Transaction error: ${error.message}. This may be due to network issues or insufficient gas.`;
        }
        
        return {
          success: false,
          message: errorMessage,
          error: error,
          debug: {
            errorType: error.name,
            errorStack: error.stack,
            timestamp: new Date().toISOString()
          }
        };
      }
    },
  }),
];