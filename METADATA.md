# Music Metadata Standard for Story Protocol Integration

## Standardized JSON Schema for Music Metadata Submission

This schema encompasses all major music identifiers (ISRC, ISWC, UPC) and rights categories while maintaining flexibility for agent-based processing on the Dérive platform.

```json
{
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
      }
    ]
  },
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
