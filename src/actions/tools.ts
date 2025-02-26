import { action } from "@daydreamsai/core";
import { z } from "zod";

// Define the schema for music metadata based on the template
const releaseTypeEnum = z.enum(["album", "single", "EP"]);

const labelSchema = z.object({
  name: z.string().describe("Name of the label"),
  id: z.string().describe("Unique identifier for the label")
});

const publisherSchema = z.object({
  name: z.string().describe("Name of the publisher"),
  ipi: z.string().describe("IPI number of the publisher"),
  split: z.number().min(0).max(100).describe("Publisher's percentage split")
});

const writerSchema = z.object({
  name: z.string().describe("Name of the songwriter"),
  ipi: z.string().describe("IPI number of the songwriter"),
  role: z.string().describe("Role of the songwriter (e.g., Composer, Lyricist)"),
  split: z.number().min(0).max(100).describe("Songwriter's percentage split"),
  publisher: publisherSchema.optional().describe("Publisher information"),
  pro: z.string().describe("Performance Rights Organization affiliation")
});

// Enhanced description for moral rights based on Story Protocol integration
const moralRightsSchema = z.object({
  attribution: z.boolean().describe("Must credit original creator - stored as boolean flag in IP Asset metadata"),
  integrity: z.boolean().describe("Cannot modify in harmful ways - enforced through attestations"),
  disclosure: z.boolean().describe("Creator controls first publication - linked to creator identity"),
  withdrawal: z.boolean().describe("Can withdraw after publication - controlled via smart contract")
});

const rightsHolderSchema = z.object({
  entity: z.string().describe("Name of the rights holder"),
  percentage: z.number().min(0).max(100).describe("Percentage of rights"),
  collectingOrganization: z.string().optional().describe("Organization collecting royalties")
});

const performerSchema = z.object({
  name: z.string().describe("Name of the performer"),
  isni: z.string().optional().describe("ISNI number of the performer"),
  role: z.string().describe("Role of the performer (e.g., MainArtist, FeaturedArtist)"),
  split: z.number().min(0).max(100).describe("Performer's percentage split")
});

const producerSchema = z.object({
  name: z.string().describe("Name of the producer"),
  role: z.string().describe("Role of the producer"),
  split: z.number().min(0).max(100).describe("Producer's percentage split")
});

const masterOwnerSchema = z.object({
  name: z.string().describe("Name of the master owner"),
  percentage: z.number().min(0).max(100).describe("Percentage of ownership")
});

const attestationSchema = z.object({
  attester: z.string().describe("Entity providing the attestation"),
  attestationType: z.string().describe("Type of attestation"),
  timestamp: z.string().describe("Timestamp of attestation")
});

// Enhanced description for public performing rights based on Story Protocol integration
const publicPerformingRightsSchema = z.object({
  holders: z.array(z.object({
    entity: z.string().describe("Name of the rights holder"),
    percentage: z.number().min(0).max(100).describe("Percentage of rights - registered as allocations in IP Asset"),
    collectingOrganization: z.string().describe("Organization collecting royalties - facilitates off-chain collection")
  })),
  restrictions: z.array(z.string()).describe("Any restrictions on public performance rights")
});

// Enhanced description for mechanical rights based on Story Protocol integration
const mechanicalRightsSchema = z.object({
  holders: z.array(z.object({
    entity: z.string().describe("Name of the rights holder"),
    percentage: z.number().min(0).max(100).describe("Percentage of rights - encoded in license terms")
  })),
  statutoryRate: z.boolean().describe("Whether statutory rate applies - stored in license parameters"),
  customRate: z.string().nullable().describe("Custom rate if not using statutory rate - stored in license tokens")
});

const compositionRightsSchema = z.object({
  moralRights: moralRightsSchema,
  publicPerformingRights: publicPerformingRightsSchema,
  mechanicalRights: mechanicalRightsSchema
});

// Enhanced description for neighbouring rights based on Story Protocol integration
const neighbouringRightsSchema = z.object({
  holders: z.array(z.object({
    entity: z.string().describe("Name of the rights holder"),
    role: z.string().describe("Role of the rights holder"),
    percentage: z.number().min(0).max(100).describe("Percentage of rights - used for Royalty Vault allocation"),
    collectingOrganization: z.string().describe("Organization collecting royalties - integrated with Royalty Module")
  }))
});

// Enhanced description for master license terms based on Story Protocol integration
const masterLicenseTermsSchema = z.object({
  allowSampling: z.boolean().describe("Whether sampling is allowed - represented as license template"),
  samplingFee: z.string().describe("Fee for sampling - encoded in license tokens"),
  allowSynchronization: z.boolean().describe("Whether synchronization is allowed - part of license terms"),
  territorialRestrictions: z.array(z.string()).describe("Territorial restrictions - enforced via smart contract"),
  exclusivity: z.boolean().describe("Whether license is exclusive - encoded in license NFT")
});

// Enhanced description for performance royalties based on Story Protocol integration
const performanceRoyaltiesSchema = z.object({
  streamingRate: z.string().describe("Rate for streaming - triggers royalty deposits via oracle integration"),
  radioRate: z.string().describe("Rate for radio - managed by Royalty Module"),
  publicVenueRate: z.string().describe("Rate for public venues - automated via smart contracts")
});

const recordingRightsSchema = z.object({
  neighbouringRights: neighbouringRightsSchema,
  masterLicenseTerms: masterLicenseTermsSchema,
  performanceRoyalties: performanceRoyaltiesSchema
});

// Enhanced description for Story Protocol metadata based on technical implementation
const storyProtocolMetadataSchema = z.object({
  ipAssetType: z.string().describe("Type of IP asset - registered in IP Core"),
  parentIpAssetId: z.string().describe("ID of parent IP asset for derivatives - enables relationship graphs"),
  licenseTemplate: z.string().describe("License template to use - from Licensing Module"),
  attestations: z.array(attestationSchema),
  disputeResolution: z.string().describe("Dispute resolution method - linked to Dispute Module"),
  additionalTerms: z.record(z.any()).describe("Additional terms - stored in IP Account (ERC-6551)")
});

const compositionSchema = z.object({
  title: z.string().describe("Title of the composition"),
  iswc: z.string().describe("ISWC identifier"),
  writers: z.array(writerSchema),
  rights: compositionRightsSchema
});

const recordingSchema = z.object({
  performers: z.array(performerSchema),
  producers: z.array(producerSchema),
  masterOwner: masterOwnerSchema,
  rights: recordingRightsSchema
});

const trackSchema = z.object({
  position: z.number().int().positive().describe("Position of the track in the release"),
  title: z.string().describe("Title of the track"),
  duration: z.string().describe("Duration of the track (e.g., '3:45')"),
  isrc: z.string().describe("ISRC identifier"),
  explicit: z.boolean().describe("Whether the track contains explicit content"),
  language: z.string().describe("Language of the track"),
  composition: compositionSchema,
  recording: recordingSchema,
  storyProtocolMetadata: storyProtocolMetadataSchema
});

const releaseSchema = z.object({
  title: z.string().describe("Title of the release"),
  type: releaseTypeEnum.describe("Type of release (album, single, EP)"),
  upc: z.string().describe("UPC/EAN identifier"),
  catalogNumber: z.string().describe("Catalog number"),
  releaseDate: z.string().describe("Release date (YYYY-MM-DD)"),
  label: labelSchema,
  genre: z.array(z.string()).describe("Genres of the release"),
  territories: z.array(z.string()).describe("Territories for the release"),
  distributionPlatforms: z.array(z.string()).describe("Distribution platforms"),
  tracks: z.array(trackSchema).min(1).describe("Tracks in the release")
});

const submitterSchema = z.object({
  name: z.string().describe("Name of the submitter"),
  role: z.string().describe("Role of the submitter"),
  walletAddress: z.string().describe("Wallet address of the submitter - used for attestation verification"),
  email: z.string().email().describe("Email of the submitter"),
  timestamp: z.string().describe("Timestamp of submission"),
  signature: z.string().describe("Signature of the submitter - verified by Attestation Services")
});

const musicMetadataSchema = z.object({
  release: releaseSchema,
  submitter: submitterSchema
});

// Type definitions based on the schema
export type MusicMetadata = z.infer<typeof musicMetadataSchema>;
export type Release = z.infer<typeof releaseSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Recording = z.infer<typeof recordingSchema>;
export type Submitter = z.infer<typeof submitterSchema>;

// Memory interface for storing metadata
export interface MusicMetadataMemory {
  metadata: MusicMetadata | null;
  missingFields: string[];
  validationErrors: string[];
  history: string[];
  lastUpdated: number;
}

export const metadataActions = [
  action({
    name: "formatMusicMetadata",
    description: "Formats and validates music metadata according to the Story Protocol standard. Identifies missing or invalid fields and prompts the user for additional information when needed. Ensures all required metadata fields are properly formatted and complete before submission to the Story Protocol. Integrates with IP Core for specialized storage of music metadata with complex relationship graphs.",
    schema: z.object({
      metadata: z.record(z.any()).describe("The music metadata to format and validate"),
      validateOnly: z.boolean().optional().default(false).describe("If true, only validates the metadata without storing it")
    }),
    handler(call, ctx, agent) {
      // Initialize metadata memory if it doesn't exist
      if (!ctx.agentMemory) {
        ctx.agentMemory = {
          metadata: null,
          missingFields: [],
          validationErrors: [],
          history: [],
          lastUpdated: Date.now()
        } as MusicMetadataMemory;
      }

      const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
      
      // Initialize history array if it doesn't exist
      if (!metadataMemory.history) {
        metadataMemory.history = [];
      }
      
      // Reset validation errors and missing fields
      metadataMemory.validationErrors = [];
      metadataMemory.missingFields = [];
      
      // Parse and validate the input metadata
      const validationResult = musicMetadataSchema.safeParse(call.data.metadata);
      
      if (!validationResult.success) {
        // Extract and format validation errors
        const formattedErrors = validationResult.error.errors.map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        
        metadataMemory.validationErrors = formattedErrors;
        
        // Identify missing required fields
        const missingFields = validationResult.error.errors
          .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
          .map(err => err.path.join('.'));
        
        metadataMemory.missingFields = [...new Set(missingFields)]; // Remove duplicates
        
        // Add to history
        metadataMemory.history.push(`Validation failed with ${formattedErrors.length} errors`);
        metadataMemory.lastUpdated = Date.now();
        
        // Return validation results
        return {
          success: false,
          validationErrors: formattedErrors,
          missingFields: metadataMemory.missingFields,
          timestamp: Date.now(),
          message: "Metadata validation failed. Please provide the missing required information."
        };
      }
      
      // If validation succeeded and we're not just validating
      if (!call.data.validateOnly) {
        // Store the validated metadata
        metadataMemory.metadata = validationResult.data;
        metadataMemory.history.push("Metadata successfully validated and stored");
        metadataMemory.lastUpdated = Date.now();
      }
      
      // Return success
      return {
        success: true,
        metadata: validationResult.data,
        timestamp: Date.now(),
        message: call.data.validateOnly 
          ? "Metadata validation successful." 
          : "Metadata successfully validated and stored."
      };
    },
  }),
  
  action({
    name: "getMissingMetadataFields",
    description: "Returns a list of missing required fields from the music metadata that need to be provided by the user. Part of the goal-oriented planning system that ensures completeness of rights information.",
    schema: z.object({}),
    handler(call, ctx, agent) {
      if (!ctx.agentMemory) {
        return { 
          error: "Metadata memory not initialized", 
          timestamp: Date.now() 
        };
      }

      const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
      
      return {
        missingFields: metadataMemory.missingFields || [],
        validationErrors: metadataMemory.validationErrors || [],
        timestamp: Date.now()
      };
    },
  }),
  
  action({
    name: "updateMusicMetadata",
    description: "Updates specific fields in the music metadata. Can be used to fill in missing information identified by the formatMusicMetadata action. Part of the structured task execution system that verifies data quality and integration with Story Protocol.",
    schema: z.object({
      path: z.string().describe("The dot-notation path to the field to update (e.g., 'release.title')"),
      value: z.any().describe("The value to set at the specified path")
    }),
    handler(call, ctx, agent) {
      if (!ctx.agentMemory) {
        return { 
          error: "Metadata memory not initialized", 
          timestamp: Date.now() 
        };
      }

      const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
      
      if (!metadataMemory.metadata) {
        metadataMemory.metadata = {
          release: {
            tracks: []
          },
          submitter: {}
        } as any;
      }
      
      // Parse the path and update the value
      const pathParts = call.data.path.split('.');
      let current: any = metadataMemory.metadata;
      
      // Navigate to the parent object of the field to update
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        
        // Handle array indices in the path (e.g., 'release.tracks.0.title')
        if (!isNaN(Number(part)) && Array.isArray(current)) {
          const index = Number(part);
          if (!current[index]) {
            current[index] = {};
          }
          current = current[index];
          continue;
        }
        
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the value at the final path part
      const finalPart = pathParts[pathParts.length - 1];
      current[finalPart] = call.data.value;
      
      // Initialize history array if it doesn't exist
      if (!metadataMemory.history) {
        metadataMemory.history = [];
      }
      
      // Add to history
      metadataMemory.history.push(`Updated field: ${call.data.path}`);
      metadataMemory.lastUpdated = Date.now();
      
      // Remove from missing fields if it was missing
      if (metadataMemory.missingFields && metadataMemory.missingFields.includes(call.data.path)) {
        metadataMemory.missingFields = metadataMemory.missingFields.filter(field => field !== call.data.path);
      }
      
      return {
        success: true,
        path: call.data.path,
        value: call.data.value,
        timestamp: Date.now()
      };
    },
  }),
  
  action({
    name: "getMusicMetadata",
    description: "Retrieves the current music metadata stored in the agent's memory. Used for verification before integration with Story Protocol components.",
    schema: z.object({}),
    handler(call, ctx, agent) {
      if (!ctx.agentMemory) {
        return { 
          error: "Metadata memory not initialized", 
          timestamp: Date.now() 
        };
      }

      const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
      
      return {
        metadata: metadataMemory.metadata,
        timestamp: Date.now()
      };
    },
  }),
  
  action({
    name: "generateMetadataTemplate",
    description: "Generates an empty metadata template with all required fields according to the Story Protocol standard. Includes all necessary fields for integration with IP Core, Licensing Module, Royalty Module, and other Story Protocol components.",
    schema: z.object({
      releaseType: releaseTypeEnum.optional().default("album").describe("Type of release (album, single, EP)"),
      trackCount: z.number().int().positive().optional().default(1).describe("Number of tracks to include in the template")
    }),
    handler(call, ctx, agent) {
      // Create a timestamp for the template
      const now = new Date();
      const timestamp = now.toISOString();
      
      // Generate empty tracks based on trackCount
      const tracks = [];
      for (let i = 0; i < call.data.trackCount; i++) {
        tracks.push({
          position: i + 1,
          title: "",
          duration: "",
          isrc: "",
          explicit: false,
          language: "en",
          
          composition: {
            title: "",
            iswc: "",
            writers: [
              {
                name: "",
                ipi: "",
                role: "Composer",
                split: 100.0,
                publisher: {
                  name: "",
                  ipi: "",
                  split: 50.0
                },
                pro: ""
              }
            ],
            rights: {
              moralRights: {
                attribution: true,
                integrity: true,
                disclosure: true,
                withdrawal: false
              },
              publicPerformingRights: {
                holders: [
                  {
                    entity: "",
                    percentage: 50.0,
                    collectingOrganization: ""
                  },
                  {
                    entity: "",
                    percentage: 50.0,
                    collectingOrganization: ""
                  }
                ],
                restrictions: []
              },
              mechanicalRights: {
                holders: [
                  {
                    entity: "",
                    percentage: 50.0
                  },
                  {
                    entity: "",
                    percentage: 50.0
                  }
                ],
                statutoryRate: true,
                customRate: null
              }
            }
          },
          
          recording: {
            performers: [
              {
                name: "",
                isni: "",
                role: "MainArtist",
                split: 100.0
              }
            ],
            producers: [
              {
                name: "",
                role: "Producer",
                split: 5.0
              }
            ],
            masterOwner: {
              name: "",
              percentage: 95.0
            },
            rights: {
              neighbouringRights: {
                holders: [
                  {
                    entity: "",
                    role: "MainArtist",
                    percentage: 45.0,
                    collectingOrganization: ""
                  },
                  {
                    entity: "",
                    role: "MasterOwner",
                    percentage: 50.0,
                    collectingOrganization: ""
                  },
                  {
                    entity: "",
                    role: "Producer",
                    percentage: 5.0,
                    collectingOrganization: ""
                  }
                ]
              },
              masterLicenseTerms: {
                allowSampling: true,
                samplingFee: "Negotiable",
                allowSynchronization: true,
                territorialRestrictions: [],
                exclusivity: false
              },
              performanceRoyalties: {
                streamingRate: "Standard",
                radioRate: "Standard",
                publicVenueRate: "Standard"
              }
            }
          },
          
          storyProtocolMetadata: {
            ipAssetType: "SOUND_RECORDING",
            parentIpAssetId: "",
            licenseTemplate: "MUSIC_STANDARD_V1",
            attestations: [
              {
                attester: "DerivePlatform",
                attestationType: "METADATA_VERIFICATION",
                timestamp: timestamp
              }
            ],
            disputeResolution: "ARBITRATION",
            additionalTerms: {}
          }
        });
      }
      
      // Create the template
      const template = {
        release: {
          title: "",
          type: call.data.releaseType,
          upc: "",
          catalogNumber: "",
          releaseDate: now.toISOString().split('T')[0],
          label: {
            name: "",
            id: ""
          },
          genre: [],
          territories: ["WORLDWIDE"],
          distributionPlatforms: [],
          tracks: tracks
        },
        submitter: {
          name: "",
          role: "",
          walletAddress: "",
          email: "",
          timestamp: timestamp,
          signature: ""
        }
      };
      
      // Store in memory if available
      if (ctx.agentMemory) {
        const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
        metadataMemory.metadata = template as MusicMetadata;
        
        // Initialize history array if it doesn't exist
        if (!metadataMemory.history) {
          metadataMemory.history = [];
        }
        
        // Add to history
        metadataMemory.history.push(`Generated empty ${call.data.releaseType} template with ${call.data.trackCount} tracks`);
        metadataMemory.lastUpdated = Date.now();
      }
      
      return {
        template: template,
        timestamp: Date.now()
      };
    },
  }),
  
  action({
    name: "prepareStoryProtocolIntegration",
    description: "Prepares the metadata for integration with Story Protocol. This action analyzes the music metadata and formats it for IP registration, including preparing IP Core registration details, licensing module templates, royalty distributions, and attestations. Use this action before registerIPAsset to ensure the metadata is properly formatted for Story Protocol.",
    schema: z.object({}),
    handler(call, ctx, agent) {
      if (!ctx.agentMemory) {
        return { 
          error: "Metadata memory not initialized", 
          timestamp: Date.now() 
        };
      }

      const metadataMemory = ctx.agentMemory as MusicMetadataMemory;
      
      if (!metadataMemory.metadata) {
        return {
          error: "No metadata available to prepare for Story Protocol integration",
          timestamp: Date.now()
        };
      }
      
      // Prepare integration details
      const integrationDetails = {
        ipCoreRegistration: {
          assetType: "MUSIC",
          relationships: metadataMemory.metadata.release.tracks.map(track => ({
            composition: {
              id: `COMP-${track.composition.iswc || "PENDING"}`,
              type: "MUSICAL_COMPOSITION"
            },
            recording: {
              id: `REC-${track.isrc || "PENDING"}`,
              type: "SOUND_RECORDING"
            }
          }))
        },
        licensingModule: {
          templates: metadataMemory.metadata.release.tracks.map(track => ({
            trackId: track.isrc || "PENDING",
            licenseTemplates: [
              {
                name: "STANDARD_STREAMING",
                terms: track.recording.rights.performanceRoyalties
              },
              {
                name: "SAMPLING_LICENSE",
                terms: track.recording.rights.masterLicenseTerms
              }
            ]
          }))
        },
        royaltyModule: {
          distributions: metadataMemory.metadata.release.tracks.map(track => ({
            trackId: track.isrc || "PENDING",
            compositionRoyalties: track.composition.rights.publicPerformingRights.holders,
            recordingRoyalties: track.recording.rights.neighbouringRights.holders
          }))
        },
        attestations: {
          metadata: {
            attester: "DerivePlatform",
            timestamp: new Date().toISOString(),
            type: "METADATA_VERIFICATION"
          },
          ownership: {
            attester: metadataMemory.metadata.submitter.name,
            timestamp: metadataMemory.metadata.submitter.timestamp,
            signature: metadataMemory.metadata.submitter.signature,
            walletAddress: metadataMemory.metadata.submitter.walletAddress
          }
        }
      };
      
      // Add to history
      metadataMemory.history.push("Prepared metadata for Story Protocol integration");
      metadataMemory.lastUpdated = Date.now();
      
      return {
        success: true,
        integrationDetails,
        timestamp: Date.now(),
        message: "Metadata prepared for Story Protocol integration"
      };
    }
  }),
  
  action({
    name: "validateMetadataForIPRegistration",
    description: "Validates music metadata to ensure it meets the requirements for IP registration on Story Protocol. This action checks for required fields, validates formats, and ensures the metadata is ready for registration. Use this action before attempting to register an IP asset to avoid transaction failures.",
    schema: z.object({
      metadata: z.any().describe("The music metadata to validate")
    }),
    handler(call, ctx, agent) {
      const metadata = call.data.metadata;
      
      if (!metadata) {
        return {
          valid: false,
          missingFields: ["metadata"],
          message: "No metadata provided for validation",
          timestamp: Date.now()
        };
      }
      
      const missingFields = [];
      const validationErrors = [];
      
      // Check for required release fields
      if (!metadata.release) {
        missingFields.push("release");
      } else {
        if (!metadata.release.title) missingFields.push("release.title");
        if (!metadata.release.type) missingFields.push("release.type");
        if (!metadata.release.upc) missingFields.push("release.upc");
        if (!metadata.release.releaseDate) missingFields.push("release.releaseDate");
        
        // Validate tracks
        if (!metadata.release.tracks || !Array.isArray(metadata.release.tracks) || metadata.release.tracks.length === 0) {
          missingFields.push("release.tracks");
        } else {
          // Check first track as an example
          const track = metadata.release.tracks[0];
          if (!track.title) missingFields.push("track.title");
          if (!track.isrc) missingFields.push("track.isrc");
        }
      }
      
      // Check for required submitter fields
      if (!metadata.submitter) {
        missingFields.push("submitter");
      } else {
        if (!metadata.submitter.name) missingFields.push("submitter.name");
        if (!metadata.submitter.role) missingFields.push("submitter.role");
      }
      
      // Format validation
      if (metadata.release) {
        // Validate UPC format (example: should be 12-13 digits)
        if (metadata.release.upc && !/^\d{12,13}$/.test(metadata.release.upc)) {
          validationErrors.push("release.upc format is invalid (should be 12-13 digits)");
        }
        
        // Validate release date format (should be YYYY-MM-DD)
        if (metadata.release.releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.release.releaseDate)) {
          validationErrors.push("release.releaseDate format is invalid (should be YYYY-MM-DD)");
        }
        
        // Validate tracks
        if (metadata.release.tracks && Array.isArray(metadata.release.tracks)) {
          metadata.release.tracks.forEach((track: any, index: number) => {
            // Validate ISRC format (example: should be 12 characters)
            if (track.isrc && !/^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/.test(track.isrc)) {
              validationErrors.push(`track[${index}].isrc format is invalid (should be like XX-XXX-XX-XXXXX)`);
            }
          });
        }
      }
      
      const isValid = missingFields.length === 0 && validationErrors.length === 0;
      
      return {
        valid: isValid,
        missingFields,
        validationErrors,
        message: isValid 
          ? "Metadata is valid for IP registration" 
          : "Metadata validation failed. Please fix the issues before registering.",
        timestamp: Date.now()
      };
    }
  })
];
