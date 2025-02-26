import { PinataSDK } from "pinata-web3";
import { createHash } from "crypto";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT
});

export interface IPMetadata {
  title: string;
  description: string;
  image?: string;
  imageHash?: string;
  mediaUrl?: string;
  mediaHash?: string;
  mediaType?: string;
  creators: Array<{
    name: string;
    address: string;
    description?: string;
    contributionPercent: number;
    socialMedia?: Array<{
      platform: string;
      url: string;
    }>;
  }>;
  // Allow for additional fields to be added to the metadata
  [key: string]: any;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface MetadataUploadResult {
  ipMetadataURI: string;
  ipMetadataHash: string;
  nftMetadataURI: string;
  nftMetadataHash: string;
}

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  const { IpfsHash } = await pinata.upload.json(jsonMetadata);
  return IpfsHash;
}

export async function uploadMetadataToIPFS(
  ipMetadata: IPMetadata,
  nftMetadata: NFTMetadata
): Promise<MetadataUploadResult> {
  // Upload IP metadata to IPFS
  const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
  const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
  
  // Upload NFT metadata to IPFS
  const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
  const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');
  
  return {
    ipMetadataURI: `ipfs://${ipIpfsHash}`,
    ipMetadataHash: ipHash,
    nftMetadataURI: `ipfs://${nftIpfsHash}`,
    nftMetadataHash: nftHash,
  };
}

export function createIPMetadata(
  title: string,
  description: string,
  creators: Array<{
    name: string;
    address: string;
    description?: string;
    contributionPercent: number;
  }>,
  mediaInfo?: {
    url: string;
    type: string;
  }
): IPMetadata {
  const metadata: IPMetadata = {
    title,
    description,
    creators: creators.map(creator => ({
      ...creator,
      socialMedia: [] // Add social media links if available
    }))
  };
  
  if (mediaInfo) {
    metadata.mediaUrl = mediaInfo.url;
    metadata.mediaType = mediaInfo.type;
    metadata.mediaHash = createHash('sha256').update(mediaInfo.url).digest('hex');
    
    // Use the same media for image if it's an image type
    if (mediaInfo.type.startsWith('image/')) {
      metadata.image = mediaInfo.url;
      metadata.imageHash = metadata.mediaHash;
    }
  }
  
  return metadata;
}

export function createNFTMetadata(
  name: string,
  description: string,
  image?: string,
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>
): NFTMetadata {
  return {
    name,
    description,
    image,
    attributes
  };
} 