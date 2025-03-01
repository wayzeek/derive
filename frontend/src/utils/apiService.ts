// API service for handling HTTP requests to the server
import axios from 'axios';
import { MetadataResponse } from './websocketService';

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:3000';

// Define the API endpoints
const ENDPOINTS = {
  METADATA: '/metadata',
};

// Define the API service
export const apiService = {
  /**
   * Submit metadata to the server for processing
   * @param metadata The metadata to submit
   * @returns A promise that resolves to the response from the server
   */
  submitMetadata: async (metadata: Record<string, any>): Promise<{ success: boolean; message: string; requestId: string; wsEndpoint: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.METADATA}`, metadata);
      return response.data;
    } catch (error) {
      console.error('Error submitting metadata:', error);
      throw error;
    }
  },

  /**
   * Format the metadata from the form data
   * @param formData The form data to format
   * @returns The formatted metadata
   */
  formatMetadataFromForm: (formData: any): Record<string, any> => {
    return {
      release: {
        title: "Midnight Dreams",
        type: "EP",
        upc: "123456789012",
        catalogNumber: "DERIVE001",
        releaseDate: "2024-08-15",
        label: {
          name: "Dérive Records",
          id: "DERIVE_LABEL_001"
        },
        genre: ["Electronic", "Ambient", "Downtempo"],
        territories: ["WORLDWIDE"],
        distributionPlatforms: ["Spotify", "Apple Music", "Tidal", "Bandcamp", "SoundCloud"],
        tracks: [
          {
            position: 1,
            title: "Lunar Echoes",
            duration: "4:32",
            isrc: "USRC12345678",
            explicit: false,
            language: "en",
            composition: {
              title: "Lunar Echoes",
              iswc: "T-123456789-0",
              writers: [
                {
                  name: "Alex Rivera",
                  ipi: "00000000250",
                  role: "Composer",
                  split: 70.0,
                  publisher: {
                    name: "Dérive Publishing",
                    ipi: "00000000251",
                    split: 50.0
                  },
                  pro: "ASCAP"
                },
                {
                  name: "Jamie Chen",
                  ipi: "00000000252",
                  role: "Lyricist",
                  split: 30.0,
                  publisher: {
                    name: "Moonlight Publishing",
                    ipi: "00000000253",
                    split: 50.0
                  },
                  pro: "BMI"
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
                      entity: "Alex Rivera",
                      percentage: 35.0,
                      collectingOrganization: "ASCAP"
                    },
                    {
                      entity: "Dérive Publishing",
                      percentage: 35.0,
                      collectingOrganization: "ASCAP"
                    },
                    {
                      entity: "Jamie Chen",
                      percentage: 15.0,
                      collectingOrganization: "BMI"
                    },
                    {
                      entity: "Moonlight Publishing",
                      percentage: 15.0,
                      collectingOrganization: "BMI"
                    }
                  ],
                  restrictions: []
                },
                mechanicalRights: {
                  holders: [
                    {
                      entity: "Alex Rivera",
                      percentage: 35.0
                    },
                    {
                      entity: "Dérive Publishing",
                      percentage: 35.0
                    },
                    {
                      entity: "Jamie Chen",
                      percentage: 15.0
                    },
                    {
                      entity: "Moonlight Publishing",
                      percentage: 15.0
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
                  name: "Lunar Drift",
                  isni: "0000000121212121",
                  role: "MainArtist",
                  split: 80.0
                },
                {
                  name: "Echo Void",
                  isni: "0000000343434343",
                  role: "FeaturedArtist",
                  split: 20.0
                }
              ],
              producers: [
                {
                  name: "Sam Taylor",
                  role: "Producer",
                  split: 5.0
                }
              ],
              masterOwner: {
                name: "Dérive Records",
                percentage: 95.0
              },
              rights: {
                neighbouringRights: {
                  holders: [
                    {
                      entity: "Lunar Drift",
                      role: "MainArtist",
                      percentage: 40.0,
                      collectingOrganization: "SoundExchange"
                    },
                    {
                      entity: "Echo Void",
                      role: "FeaturedArtist",
                      percentage: 5.0,
                      collectingOrganization: "SoundExchange"
                    },
                    {
                      entity: "Dérive Records",
                      role: "MasterOwner",
                      percentage: 50.0,
                      collectingOrganization: "SoundExchange"
                    },
                    {
                      entity: "Sam Taylor",
                      role: "Producer",
                      percentage: 5.0,
                      collectingOrganization: "SoundExchange"
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
                  timestamp: "2024-07-01T12:00:00Z"
                }
              ],
              disputeResolution: "ARBITRATION",
              additionalTerms: {}
            }
          },
          {
            position: 2,
            title: "Digital Dreams",
            duration: "5:17",
            isrc: "USRC87654321",
            explicit: false,
            language: "en",
            composition: {
              title: "Digital Dreams",
              iswc: "T-987654321-0",
              writers: [
                {
                  name: "Alex Rivera",
                  ipi: "00000000250",
                  role: "Composer",
                  split: 100.0,
                  publisher: {
                    name: "Dérive Publishing",
                    ipi: "00000000251",
                    split: 50.0
                  },
                  pro: "ASCAP"
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
                      entity: "Alex Rivera",
                      percentage: 50.0,
                      collectingOrganization: "ASCAP"
                    },
                    {
                      entity: "Dérive Publishing",
                      percentage: 50.0,
                      collectingOrganization: "ASCAP"
                    }
                  ],
                  restrictions: []
                },
                mechanicalRights: {
                  holders: [
                    {
                      entity: "Alex Rivera",
                      percentage: 50.0
                    },
                    {
                      entity: "Dérive Publishing",
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
                  name: "Lunar Drift",
                  isni: "0000000121212121",
                  role: "MainArtist",
                  split: 100.0
                }
              ],
              producers: [
                {
                  name: "Sam Taylor",
                  role: "Producer",
                  split: 5.0
                }
              ],
              masterOwner: {
                name: "Dérive Records",
                percentage: 95.0
              },
              rights: {
                neighbouringRights: {
                  holders: [
                    {
                      entity: "Lunar Drift",
                      role: "MainArtist",
                      percentage: 45.0,
                      collectingOrganization: "SoundExchange"
                    },
                    {
                      entity: "Dérive Records",
                      role: "MasterOwner",
                      percentage: 50.0,
                      collectingOrganization: "SoundExchange"
                    },
                    {
                      entity: "Sam Taylor",
                      role: "Producer",
                      percentage: 5.0,
                      collectingOrganization: "SoundExchange"
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
                  timestamp: "2024-07-01T12:00:00Z"
                }
              ],
              disputeResolution: "ARBITRATION",
              additionalTerms: {}
            }
          }
        ]
      },
      submitter: {
        name: "Morgan Lee",
        role: "LabelRepresentative",
        walletAddress: "0x123abc456def789ghi012jkl345mno678pqr",
        email: "morgan@deriverecords.com",
        timestamp: "2024-07-01T12:00:00Z",
        signature: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
      }
    };
  },

  /**
   * Get the explorer URL for an IP ID
   * @param ipId The IP ID to get the explorer URL for
   * @returns The explorer URL
   */
  getExplorerUrl: (ipId: string): string => {
    return `https://aeneid.storyscan.xyz/ip/${ipId}`;
  },
}; 