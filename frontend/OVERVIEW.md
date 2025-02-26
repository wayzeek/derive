# Dérive

Bridging music distributors and Story Protocol to create a unified source of truth for music rights and ownership

## Middleware Information

**Note:** The middleware will be implemented in a separate `backend` folder at the root of the project. It will be built using Express.js for the API endpoints. The middleware implementation will be added in a future PR and is not part of the current development scope.

When implemented, the middleware will handle:

- Processing incoming metadata from distributors
- Communicating with the AI agent for metadata normalization
- Registering IP with Story Protocol
- Managing the submission queue and status updates

For frontend development, mock APIs will be used temporarily until the middleware is available.

## Context

**Introduction**  
Our hackathon project aims to simplify music metadata tracking, IP registration, and licensing by leveraging Story Protocol. By integrating our service with music distributors via an API/middleware layer, our tool creates a single source of truth for song data. This foundation can later support transparent royalty tracking and automated payouts.

**Pain Points in Music Metadata Management**
i. Lack of Standardization

- No single authoritative database exists.
- Various entities use different formats, causing misalignment and dropped credits.

ii. Multiplicity of Data & Poor Linking

- Multiple assets (composition, recordings, releases) exist for each work.
- Without a universal ID, linking recordings to the original composition is error-prone.

iii. Missing or Incorrect Ownership Data

- Incomplete or inconsistent songwriter, publisher, or performer information is common.
- Errors lead to uncredited contributors and unclaimed royalties.

iv. Scale and Volume

- Tens of thousands of songs are released daily, stressing outdated systems.
- Small errors at scale result in significant royalty payment issues.

These challenges highlight the need for a unified, reliable ledger for music metadata. Our solution uses Story Protocol to create a more accurate, automated system for managing music IP metadata.

**Leveraging Story Protocol for IP Registration & Licensing Solutions**

**On-Chain IP Registration (Single Source of Truth)**

- When a distributor or rights holder adds a song, it is registered on-chain as a unique IP asset.
- The tool creates a universal record with rich metadata (title, identifiers, release date, contributors, ownership splits) that remains with the asset across systems.

**Programmable Licensing Terms**

- Once registered, rights owners can encode licensing conditions using smart contracts.
- License tokens, backed by standardized smart contract templates, allow for automated mechanical, distribution, or sync licenses.
- The system automatically checks that any derivative or license complies with the original terms.

**Persistent Creator Attribution and Moral Rights**

- All creative contributions are permanently recorded on-chain, ensuring original authors are always credited.
- The system protects moral rights and prevents tampering, guaranteeing that creator identities remain linked to the work.

**Dérive as an Attestation Provider**

- The goal would be to become an attestation provider for Distributors wanting to integrate the registering metadata onchain.
- https://docs.story.foundation/docs/story-attestation-service

**Open Accessibility and Composability**

- Registering music IP on Story creates a universally accessible repository.
- Any platform with proper permissions can query or build on this data, paving the way for a global, up-to-date repertoire database.

# Music Metadata Standard for Story Protocol Integration

## Standardized JSON Schema for Music Metadata Submission

This schema encompasses all major music identifiers (ISRC, ISWC, UPC) and rights categories while maintaining flexibility for agent-based processing on the Dérive platform.

```json
{
  "$schema": "https://derive.ai/schemas/music-metadata/v1.0",
  "release": {
    "title": "Album Title",
    "type": "album", // album, single, EP
    "upc": "123456789012",
    "catalogNumber": "LABEL001",
    "releaseDate": "2024-07-01",
    "label": {
      "name": "Label Name",
      "id": "LABEL_ID"
    },
    "genre": ["Pop", "Electronic"],
    "territories": ["WORLDWIDE"],
    "distributionPlatforms": ["Spotify", "Apple Music", "Tidal"],
    "tracks": [
      {
        "position": 1,
        "title": "Track Title",
        "duration": "3:45",
        "isrc": "USRC12345678",
        "explicit": false,
        "language": "en",

        "composition": {
          "title": "Composition Title", // May differ from track title
          "iswc": "T-123456789-0",
          "writers": [
            {
              "name": "Songwriter Name",
              "ipi": "00000000250",
              "role": "Composer",
              "split": 50.0,
              "publisher": {
                "name": "Publisher Name",
                "ipi": "00000000251",
                "split": 50.0
              },
              "pro": "ASCAP" // PRO affiliation
            }
          ],
          "rights": {
            "moralRights": {
              "attribution": true, // Must credit original creator
              "integrity": true, // Cannot modify in harmful ways
              "disclosure": true, // Creator controls first publication
              "withdrawal": false // Cannot withdraw after publication
            },
            "publicPerformingRights": {
              "holders": [
                {
                  "entity": "Songwriter Name",
                  "percentage": 50.0,
                  "collectingOrganization": "ASCAP"
                },
                {
                  "entity": "Publisher Name",
                  "percentage": 50.0,
                  "collectingOrganization": "ASCAP"
                }
              ],
              "restrictions": []
            },
            "mechanicalRights": {
              "holders": [
                {
                  "entity": "Songwriter Name",
                  "percentage": 50.0
                },
                {
                  "entity": "Publisher Name",
                  "percentage": 50.0
                }
              ],
              "statutoryRate": true,
              "customRate": null
            }
          }
        },

        "recording": {
          "performers": [
            {
              "name": "Artist Name",
              "isni": "0000000121212121",
              "role": "MainArtist",
              "split": 80.0
            },
            {
              "name": "Featured Artist",
              "isni": "0000000343434343",
              "role": "FeaturedArtist",
              "split": 20.0
            }
          ],
          "producers": [
            {
              "name": "Producer Name",
              "role": "Producer",
              "split": 5.0
            }
          ],
          "masterOwner": {
            "name": "Label Name",
            "percentage": 80.0
          },
          "rights": {
            "neighbouringRights": {
              "holders": [
                {
                  "entity": "Artist Name",
                  "role": "MainArtist",
                  "percentage": 45.0,
                  "collectingOrganization": "SoundExchange"
                },
                {
                  "entity": "Label Name",
                  "role": "MasterOwner",
                  "percentage": 50.0,
                  "collectingOrganization": "SoundExchange"
                },
                {
                  "entity": "Producer Name",
                  "role": "Producer",
                  "percentage": 5.0,
                  "collectingOrganization": "SoundExchange"
                }
              ]
            },
            "masterLicenseTerms": {
              "allowSampling": true,
              "samplingFee": "Negotiable",
              "allowSynchronization": true,
              "territorialRestrictions": [],
              "exclusivity": false
            },
            "performanceRoyalties": {
              "streamingRate": "Standard",
              "radioRate": "Standard",
              "publicVenueRate": "Standard"
            }
          }
        },

        "storyProtocolMetadata": {
          "ipAssetType": "SOUND_RECORDING",
          "parentIpAssetId": "", // For remixes, samples, etc.
          "licenseTemplate": "MUSIC_STANDARD_V1",
          "attestations": [
            {
              "attester": "DerivePlatform",
              "attestationType": "METADATA_VERIFICATION",
              "timestamp": "2024-07-01T12:00:00Z"
            }
          ],
          "disputeResolution": "ARBITRATION",
          "additionalTerms": {}
        }
      }
    ]
  },

  "submitter": {
    "name": "Submitter Name",
    "role": "LabelRepresentative",
    "walletAddress": "0x123...",
    "email": "contact@example.com",
    "timestamp": "2024-07-01T12:00:00Z",
    "signature": "0x..."
  }
}
```

## On-Chain Rights Integration with Story Protocol

### Type of Rights

#### 1. Moral Rights

- **On-Chain Implementation**: Stored as boolean flags in IP Asset metadata
- **Enforcement**: Original creator's identity permanently linked to IP Asset via attestations
- **Smart Contract Function**: Prevents removal of attribution in derivative works

#### 2. Public Performing Rights (Composition)

- **On-Chain Implementation**: Registered as percentage allocations within the IP Asset
- **PRO Integration**: PRO affiliations stored as metadata to facilitate off-chain royalty collection
- **Story Protocol Module**: Links to Royalty Module for automated distribution when integrated with PROs

#### 3. Mechanical Rights

- **On-Chain Implementation**: Encoded as license terms between composition and recording IP Assets
- **License Parameters**: Royalty rates, payment schedules, usage limitations stored in license tokens
- **Enforcement**: Story's Licensing Module validates all derivative uses against terms

#### 4. Neighbouring Rights (Recording)

- **On-Chain Implementation**: Performer and producer contributions with percentage splits
- **Attribution**: Permanent record of all contributors to prevent missing credits
- **Royalty Distribution**: Royalty Vault allocates funds according to recorded splits

#### 5. Master License Terms

- **On-Chain Implementation**: Custom license templates for each usage type (sync, sampling, etc.)
- **License Tokens**: Non-fungible tokens representing granted licenses with specific terms
- **License Negotiation**: Agent-facilitated negotiation with rights holders via Story's terms system

#### 6. Performance Royalties

- **On-Chain Implementation**: Integration with the Royalty Module tracks usage and distributes payments
- **Automatic Splits**: Smart contracts automatically allocate incoming royalties based on registered percentages
- **Payment Triggers**: Oracle integration monitors usage and triggers royalty deposits to Royalty Vault

## Technical Implementation

### Story Protocol Components Used

- **IP Core**: Specialized storage for music metadata with complex relationship graphs
- **Licensing Module**: Creates and enforces license tokens with programmable terms
- **Royalty Module**: Manages automatic distribution of revenue according to splits
- **Dispute Module**: Enables flagging of unauthorized usage or rights violations
- **Attestation Services**: Verifies identity and authenticity of registered assets
- **IP Account (ERC-6551)**: Holds metadata and enables fractional ownership

### Dérive Integration

- Dérive platform serves as an attestation provider for music metadata
- AI agents verify and process metadata during submission
- Goal-oriented planning system ensures completeness of rights information
- Structured task execution verifies data quality and integration with Story Protocol
