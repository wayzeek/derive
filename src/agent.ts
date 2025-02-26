import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  createDreams,
  createContainer,
  LogLevel,
  createMemoryStore,
  createChromaVectorStore,
} from "@daydreamsai/core";
import { goalContexts } from "./contexts/goal-context";
import { cli } from "./extensions";
import { actions } from "./actions";
import { outputs } from "./outputs";
import { createStoryClient } from './utils/story';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const model = google("gemini-2.0-flash-001") as any;

// Initialize Story Protocol client
const storyClient = createStoryClient();

// Create container and register Story Protocol client
const container = createContainer();
container.register('storyClient', () => storyClient);

// Register metadata processor
container.register('metadataProcessor', () => ({
  processMetadata: (metadata: any) => {
    // Legacy method - just return the metadata as is
    return metadata;
  },
  validateMetadata: (metadata: any) => {
    // First check if this is a different format that we need to map
    const isStandardFormat = isMetadataStandardFormat(metadata);
    
    if (!isStandardFormat) {
      // This is a different format, so reformat it first before validation
      const reformattedMetadata = reformatMetadata(metadata);
      
      // Now check for missing fields in the reformatted metadata
      const missingFields = findMissingRequiredFields(reformattedMetadata);
      
      return {
        isValid: missingFields.length === 0,
        missingFields: missingFields,
        formattingIssues: true,
        processedMetadata: reformattedMetadata
      };
    }
    
    // Check if metadata is in the correct format
    const isValidFormat = validateMetadataFormat(metadata);
    
    // Check for missing required fields
    const missingFields = findMissingRequiredFields(metadata);
    
    // If there are no missing fields but format is incorrect, reformat it
    let processedMetadata = metadata;
    if (missingFields.length === 0 && !isValidFormat) {
      processedMetadata = reformatMetadata(metadata);
      return {
        isValid: true,
        missingFields: [],
        formattingIssues: true,
        processedMetadata
      };
    }
    
    // If there are missing fields, try to guess them if possible
    if (missingFields.length > 0) {
      processedMetadata = guessAndFillMissingFields(metadata, missingFields);
      
      // Check if we still have missing fields after guessing
      const remainingMissingFields = findMissingRequiredFields(processedMetadata);
      
      return {
        isValid: remainingMissingFields.length === 0,
        missingFields: remainingMissingFields,
        formattingIssues: !isValidFormat,
        processedMetadata
      };
    }
    
    // If metadata is valid and properly formatted
    return {
      isValid: true,
      missingFields: [],
      formattingIssues: false,
      processedMetadata: metadata
    };
  }
}));

// Helper function to check if metadata is in our standard format or a different format
function isMetadataStandardFormat(metadata: any): boolean {
  // Check for standard format indicators
  if (metadata && metadata.release && metadata.submitter) {
    return true;
  }
  
  // Check for various alternative format indicators
  if (metadata) {
    // Check for common alternative format structures
    const hasAlternativeAlbumInfo = !!(
      metadata.albumInfo || 
      metadata.album || 
      metadata.collection || 
      (metadata.title && !metadata.release)
    );
    
    const hasAlternativeTracks = !!(
      metadata.songs || 
      metadata.tracks || 
      (metadata.albumInfo && metadata.albumInfo.songs) || 
      (metadata.albumInfo && metadata.albumInfo.tracks) || 
      (metadata.album && metadata.album.tracks) || 
      (metadata.album && metadata.album.songs) || 
      (metadata.collection && metadata.collection.tracks)
    );
    
    const hasAlternativeSubmitter = !!(
      metadata.submitterInfo || 
      metadata.uploader || 
      metadata.creator || 
      metadata.user || 
      metadata.submitterName || 
      metadata.uploaderName || 
      metadata.creatorName
    );
    
    // If we have alternative structures for album, tracks, and submitter, it's not standard format
    if (hasAlternativeAlbumInfo && hasAlternativeTracks && hasAlternativeSubmitter) {
      return false;
    }
  }
  
  // Default to standard format if we can't determine
  return true;
}

// Helper functions for metadata validation
function validateMetadataFormat(metadata: any): boolean {
  // Check if metadata has the expected structure
  if (!metadata || typeof metadata !== 'object') return false;
  
  // Check for any valid metadata format
  
  // First, look for tracks/songs in any format
  const tracks = findAlternativeTracks(metadata);
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return false; // No tracks found in any format
  }
  
  // Check for required release fields
  const hasReleaseTitle = findPossibleFieldValues(metadata, [
    'release.title', 'albumInfo.name', 'albumInfo.title', 'album.title', 'album.name',
    'albumName', 'albumTitle', 'title', 'name', 'collection.name'
  ]).length > 0;
  
  const hasReleaseType = findPossibleFieldValues(metadata, [
    'release.type', 'albumInfo.releaseFormat', 'albumInfo.type', 'album.type', 'album.format',
    'releaseType', 'releaseFormat', 'type', 'format'
  ]).length > 0;
  
  const hasReleaseDate = findPossibleFieldValues(metadata, [
    'release.releaseDate', 'albumInfo.releaseDate', 'albumInfo.date', 'album.releaseDate', 'album.date',
    'releaseDate', 'date', 'publicationDate', 'publishDate'
  ]).length > 0;
  
  const hasUPC = findPossibleFieldValues(metadata, [
    'release.upc', 'albumInfo.barcode', 'albumInfo.upc', 'album.upc', 'album.barcode',
    'upc', 'barcode', 'ean'
  ]).length > 0;
  
  if (!hasReleaseTitle || !hasReleaseType || !hasReleaseDate || !hasUPC) {
    return false;
  }
  
  // Check if each track has basic required information
  for (const track of tracks) {
    // Check if track has title or equivalent
    const hasTitle = findPossibleFieldValues(track, [
      'title', 'name', 'songTitle', 'trackTitle', 'trackName'
    ]).length > 0;
    
    // Check if track has ISRC
    const hasISRC = findPossibleFieldValues(track, [
      'isrc', 'isrcCode', 'trackIsrc', 'recordingIsrc'
    ]).length > 0;
    
    // Check if track has composition/songwriting information
    const hasComposition = !!track.composition || 
                          !!track.songwritingInfo || 
                          !!track.songwriting || 
                          !!track.writers || 
                          !!track.composer || 
                          !!track.composers;
    
    // Check if track has ISWC
    const hasISWC = findPossibleFieldValues(track, [
      'composition.iswc', 'songwritingInfo.iswcCode', 'songwriting.iswc', 'iswc'
    ]).length > 0;
    
    // Check if track has writers
    const hasWriters = findWriters(track).length > 0;
    
    // Check if track has recording information
    const hasRecording = !!track.recording || 
                        !!track.recordingInfo || 
                        !!track.performers || 
                        !!track.artists || 
                        !!track.artist;
    
    // Check if track has performers
    const hasPerformers = findPerformers(track).length > 0;
    
    // Check if track has producers
    const hasProducers = findProducers(track).length > 0;
    
    // If track is missing basic information, format is invalid
    if (!hasTitle || !hasISRC || !hasComposition || !hasISWC || !hasWriters || 
        !hasRecording || !hasPerformers || !hasProducers) {
      return false;
    }
  }
  
  // Check for submitter information in any format
  const hasSubmitterName = findPossibleFieldValues(metadata, [
    'submitter.name', 'submitterInfo.submitterName', 'submitterInfo.name',
    'uploader.name', 'creator.name', 'user.name',
    'submitterName', 'uploaderName', 'creatorName', 'userName'
  ]).length > 0;
  
  const hasSubmitterRole = findPossibleFieldValues(metadata, [
    'submitter.role', 'submitterInfo.submitterRole', 'submitterInfo.role',
    'uploader.role', 'creator.role', 'user.role',
    'submitterRole', 'uploaderRole', 'creatorRole', 'userRole'
  ]).length > 0;
  
  const hasWalletAddress = findPossibleFieldValues(metadata, [
    'submitter.walletAddress', 'submitterInfo.walletAddress', 'submitterInfo.wallet',
    'uploader.walletAddress', 'creator.walletAddress', 'user.walletAddress',
    'walletAddress', 'wallet', 'address'
  ]).length > 0;
  
  const hasSignature = findPossibleFieldValues(metadata, [
    'submitter.signature', 'submitterInfo.digitalSignature', 'submitterInfo.signature',
    'uploader.signature', 'creator.signature', 'user.signature',
    'signature', 'digitalSignature'
  ]).length > 0;
  
  if (!hasSubmitterName || !hasSubmitterRole || !hasWalletAddress || !hasSignature) {
    return false;
  }
  
  // If we've made it this far, the format is valid enough to work with
  return true;
}

function findMissingRequiredFields(metadata: any): string[] {
  const missingFields: string[] = [];
  
  // Check if metadata exists
  if (!metadata || typeof metadata !== 'object') {
    return ['metadata'];
  }
  
  // Find tracks in any format
  const tracks = findAlternativeTracks(metadata);
  
  // Check for release title equivalent
  const releaseTitleFields = findPossibleFieldValues(metadata, [
    'release.title', 'albumInfo.name', 'albumInfo.title', 'album.title', 'album.name',
    'albumName', 'albumTitle', 'title', 'name', 'collection.name'
  ]);
  
  if (releaseTitleFields.length === 0 || !releaseTitleFields[0]) {
    missingFields.push('release.title');
  }
  
  // Check for release type equivalent
  const releaseTypeFields = findPossibleFieldValues(metadata, [
    'release.type', 'albumInfo.releaseFormat', 'albumInfo.type', 'album.type', 'album.format',
    'releaseType', 'releaseFormat', 'type', 'format'
  ]);
  
  if (releaseTypeFields.length === 0 || !releaseTypeFields[0]) {
    missingFields.push('release.type');
  }
  
  // Check for release date equivalent
  const releaseDateFields = findPossibleFieldValues(metadata, [
    'release.releaseDate', 'albumInfo.releaseDate', 'albumInfo.date', 'album.releaseDate', 'album.date',
    'releaseDate', 'date', 'publicationDate', 'publishDate'
  ]);
  
  if (releaseDateFields.length === 0 || !releaseDateFields[0]) {
    missingFields.push('release.releaseDate');
  }
  
  // Check for UPC
  const upcFields = findPossibleFieldValues(metadata, [
    'release.upc', 'albumInfo.barcode', 'albumInfo.upc', 'album.upc', 'album.barcode',
    'upc', 'barcode', 'ean'
  ]);
  
  if (upcFields.length === 0 || !upcFields[0]) {
    missingFields.push('release.upc');
  }
  
  // Check for tracks
  if (!Array.isArray(tracks) || tracks.length === 0) {
    missingFields.push('release.tracks');
  } else {
    // Check each track
    tracks.forEach((track, index) => {
      // Check for track title
      const trackTitleFields = findPossibleFieldValues(track, [
        'title', 'name', 'songTitle', 'trackTitle', 'trackName'
      ]);
      
      if (trackTitleFields.length === 0 || !trackTitleFields[0]) {
        missingFields.push(`release.tracks[${index}].title`);
      }
      
      // Check for track ISRC
      const trackIsrcFields = findPossibleFieldValues(track, [
        'isrc', 'isrcCode', 'trackIsrc', 'recordingIsrc'
      ]);
      
      if (trackIsrcFields.length === 0 || !trackIsrcFields[0]) {
        missingFields.push(`release.tracks[${index}].isrc`);
      }
      
      // Check for composition information
      const hasComposition = !!track.composition || 
                            !!track.songwritingInfo || 
                            !!track.songwriting || 
                            !!track.writers || 
                            !!track.composer || 
                            !!track.composers;
      
      if (!hasComposition) {
        missingFields.push(`release.tracks[${index}].composition`);
      } else {
        // Check for writers
        const writers = findWriters(track);
        
        if (writers.length === 0) {
          missingFields.push(`release.tracks[${index}].composition.writers`);
        }
        
        // Check for ISWC
        const iswcFields = findPossibleFieldValues(track, [
          'composition.iswc', 'songwritingInfo.iswcCode', 'songwriting.iswc', 'iswc'
        ]);
        
        if (iswcFields.length === 0 || !iswcFields[0]) {
          missingFields.push(`release.tracks[${index}].composition.iswc`);
        }
      }
      
      // Check for recording information
      const hasRecording = !!track.recording || 
                          !!track.recordingInfo || 
                          !!track.performers || 
                          !!track.artists || 
                          !!track.artist;
      
      if (!hasRecording) {
        missingFields.push(`release.tracks[${index}].recording`);
      } else {
        // Check for performers
        const performers = findPerformers(track);
        
        if (performers.length === 0) {
          missingFields.push(`release.tracks[${index}].recording.performers`);
        }
        
        // Check for producers
        const producers = findProducers(track);
        
        if (producers.length === 0) {
          missingFields.push(`release.tracks[${index}].recording.producers`);
        }
      }
    });
  }
  
  // Check for submitter information
  const hasSubmitter = !!findPossibleFieldValues(metadata, [
    'submitter', 'submitterInfo', 'uploader', 'creator', 'user'
  ]).length;
  
  if (!hasSubmitter) {
    missingFields.push('submitter');
  } else {
    // Check for submitter name
    const submitterNameFields = findPossibleFieldValues(metadata, [
      'submitter.name', 'submitterInfo.submitterName', 'submitterInfo.name',
      'uploader.name', 'creator.name', 'user.name',
      'submitterName', 'uploaderName', 'creatorName', 'userName'
    ]);
    
    if (submitterNameFields.length === 0 || !submitterNameFields[0]) {
      missingFields.push('submitter.name');
    }
    
    // Check for submitter role
    const submitterRoleFields = findPossibleFieldValues(metadata, [
      'submitter.role', 'submitterInfo.submitterRole', 'submitterInfo.role',
      'uploader.role', 'creator.role', 'user.role',
      'submitterRole', 'uploaderRole', 'creatorRole', 'userRole'
    ]);
    
    if (submitterRoleFields.length === 0 || !submitterRoleFields[0]) {
      missingFields.push('submitter.role');
    }
    
    // Check for wallet address
    const walletFields = findPossibleFieldValues(metadata, [
      'submitter.walletAddress', 'submitterInfo.walletAddress', 'submitterInfo.wallet',
      'uploader.walletAddress', 'creator.walletAddress', 'user.walletAddress',
      'walletAddress', 'wallet', 'address'
    ]);
    
    if (walletFields.length === 0 || !walletFields[0]) {
      missingFields.push('submitter.walletAddress');
    }
    
    // Check for signature
    const signatureFields = findPossibleFieldValues(metadata, [
      'submitter.signature', 'submitterInfo.digitalSignature', 'submitterInfo.signature',
      'uploader.signature', 'creator.signature', 'user.signature',
      'signature', 'digitalSignature'
    ]);
    
    if (signatureFields.length === 0 || !signatureFields[0]) {
      missingFields.push('submitter.signature');
    }
  }
  
  return missingFields;
}

function reformatMetadata(metadata: any): any {
  // Create a properly formatted metadata object
  const formattedMetadata: any = {
    release: {
      title: '',
      type: 'album',
      upc: '',
      catalogNumber: '',
      releaseDate: new Date().toISOString().split('T')[0],
      label: {
        name: '',
        id: ''
      },
      genre: [],
      territories: ['WORLDWIDE'],
      distributionPlatforms: [],
      tracks: []
    },
    submitter: {
      name: '',
      role: '',
      walletAddress: '',
      email: '',
      timestamp: new Date().toISOString(),
      signature: ''
    }
  };
  
  // Extract release information from any format
  
  // Find release title
  const releaseTitleFields = findPossibleFieldValues(metadata, [
    'release.title', 'albumInfo.name', 'albumInfo.title', 'album.title', 'album.name',
    'albumName', 'albumTitle', 'title', 'name', 'collection.name'
  ]);
  
  if (releaseTitleFields.length > 0) {
    formattedMetadata.release.title = releaseTitleFields[0];
  }
  
  // Find release type
  const releaseTypeFields = findPossibleFieldValues(metadata, [
    'release.type', 'albumInfo.releaseFormat', 'albumInfo.type', 'album.type', 'album.format',
    'releaseType', 'releaseFormat', 'type', 'format'
  ]);
  
  if (releaseTypeFields.length > 0) {
    formattedMetadata.release.type = mapReleaseType(releaseTypeFields[0]);
  }
  
  // Find release date
  const releaseDateFields = findPossibleFieldValues(metadata, [
    'release.releaseDate', 'albumInfo.releaseDate', 'albumInfo.date', 'album.releaseDate', 'album.date',
    'releaseDate', 'date', 'publicationDate', 'publishDate'
  ]);
  
  if (releaseDateFields.length > 0) {
    formattedMetadata.release.releaseDate = releaseDateFields[0];
  }
  
  // Find UPC
  const upcFields = findPossibleFieldValues(metadata, [
    'release.upc', 'albumInfo.barcode', 'albumInfo.upc', 'album.upc', 'album.barcode',
    'upc', 'barcode', 'ean'
  ]);
  
  if (upcFields.length > 0) {
    formattedMetadata.release.upc = upcFields[0];
  }
  
  // Find catalog number
  const catalogFields = findPossibleFieldValues(metadata, [
    'release.catalogNumber', 'albumInfo.catalogId', 'albumInfo.catalogNumber', 
    'album.catalogNumber', 'album.catalogId',
    'catalogNumber', 'catalogId', 'catalog'
  ]);
  
  if (catalogFields.length > 0) {
    formattedMetadata.release.catalogNumber = catalogFields[0];
  }
  
  // Find label information
  const labelNameFields = findPossibleFieldValues(metadata, [
    'release.label.name', 'albumInfo.recordLabel', 'albumInfo.label', 'album.label',
    'label', 'recordLabel', 'publisher'
  ]);
  
  if (labelNameFields.length > 0) {
    formattedMetadata.release.label.name = labelNameFields[0];
  }
  
  const labelIdFields = findPossibleFieldValues(metadata, [
    'release.label.id', 'albumInfo.labelId', 'albumInfo.label.id', 'album.label.id',
    'labelId'
  ]);
  
  if (labelIdFields.length > 0) {
    formattedMetadata.release.label.id = labelIdFields[0];
  }
  
  // Find genre information
  const genreFields = findPossibleFieldValues(metadata, [
    'release.genre', 'albumInfo.musicStyles', 'albumInfo.genres', 'album.genre', 'album.genres',
    'genre', 'genres', 'musicStyles', 'styles'
  ]);
  
  if (genreFields.length > 0) {
    formattedMetadata.release.genre = Array.isArray(genreFields[0]) ? genreFields[0] : [genreFields[0]];
  }
  
  // Find territories information
  const territoriesFields = findPossibleFieldValues(metadata, [
    'release.territories', 'albumInfo.territories', 'album.territories',
    'territories', 'regions'
  ]);
  
  if (territoriesFields.length > 0) {
    formattedMetadata.release.territories = Array.isArray(territoriesFields[0]) ? territoriesFields[0] : [territoriesFields[0]];
  }
  
  // Find distribution platforms
  const platformsFields = findPossibleFieldValues(metadata, [
    'release.distributionPlatforms', 'albumInfo.distribution', 'album.distributionPlatforms',
    'distributionPlatforms', 'distribution', 'platforms'
  ]);
  
  if (platformsFields.length > 0) {
    formattedMetadata.release.distributionPlatforms = Array.isArray(platformsFields[0]) ? platformsFields[0] : [platformsFields[0]];
  }
  
  // Find tracks in any format
  const tracks = findAlternativeTracks(metadata);
  
  // Map tracks to standard format
  if (Array.isArray(tracks)) {
    formattedMetadata.release.tracks = tracks.map((track, index) => {
      return formatTrack(track, index);
    });
  }
  
  // Find submitter information
  
  // Find submitter name
  const submitterNameFields = findPossibleFieldValues(metadata, [
    'submitter.name', 'submitterInfo.submitterName', 'submitterInfo.name',
    'uploader.name', 'creator.name', 'user.name',
    'submitterName', 'uploaderName', 'creatorName', 'userName'
  ]);
  
  if (submitterNameFields.length > 0) {
    formattedMetadata.submitter.name = submitterNameFields[0];
  }
  
  // Find submitter role
  const submitterRoleFields = findPossibleFieldValues(metadata, [
    'submitter.role', 'submitterInfo.submitterRole', 'submitterInfo.role',
    'uploader.role', 'creator.role', 'user.role',
    'submitterRole', 'uploaderRole', 'creatorRole', 'userRole'
  ]);
  
  if (submitterRoleFields.length > 0) {
    formattedMetadata.submitter.role = submitterRoleFields[0];
  }
  
  // Find wallet address
  const walletFields = findPossibleFieldValues(metadata, [
    'submitter.walletAddress', 'submitterInfo.walletAddress', 'submitterInfo.wallet',
    'uploader.walletAddress', 'creator.walletAddress', 'user.walletAddress',
    'walletAddress', 'wallet', 'address'
  ]);
  
  if (walletFields.length > 0) {
    formattedMetadata.submitter.walletAddress = walletFields[0];
  }
  
  // Find email
  const emailFields = findPossibleFieldValues(metadata, [
    'submitter.email', 'submitterInfo.emailAddress', 'submitterInfo.email',
    'uploader.email', 'creator.email', 'user.email',
    'email', 'emailAddress'
  ]);
  
  if (emailFields.length > 0) {
    formattedMetadata.submitter.email = emailFields[0];
  }
  
  // Find timestamp
  const timestampFields = findPossibleFieldValues(metadata, [
    'submitter.timestamp', 'submitterInfo.submissionTime', 'submitterInfo.timestamp',
    'uploader.timestamp', 'creator.timestamp', 'user.timestamp',
    'timestamp', 'submissionTime', 'creationTime', 'uploadTime'
  ]);
  
  if (timestampFields.length > 0) {
    formattedMetadata.submitter.timestamp = timestampFields[0];
  }
  
  // Find signature
  const signatureFields = findPossibleFieldValues(metadata, [
    'submitter.signature', 'submitterInfo.digitalSignature', 'submitterInfo.signature',
    'uploader.signature', 'creator.signature', 'user.signature',
    'signature', 'digitalSignature'
  ]);
  
  if (signatureFields.length > 0) {
    formattedMetadata.submitter.signature = signatureFields[0];
  }
  
  return formattedMetadata;
}

// Helper function to map release format/type
function mapReleaseType(type: string | undefined): string {
  if (!type) return 'album';
  
  const lowerType = type.toLowerCase();
  
  if (lowerType === 'ep' || lowerType === 'e.p.' || lowerType === 'e.p') {
    return 'EP';
  } else if (lowerType === 'single') {
    return 'single';
  } else if (lowerType === 'album' || lowerType === 'lp' || lowerType === 'l.p.' || lowerType === 'l.p') {
    return 'album';
  }
  
  return 'album';
}

function formatTrack(track: any, index: number): any {
  // Create a properly formatted track
  const formattedTrack: any = {
    position: index + 1,
    title: '',
    duration: '',
    isrc: '',
    explicit: false,
    language: 'en',
    composition: {
      title: '',
      iswc: '',
      writers: [],
      rights: {
        moralRights: {
          attribution: true,
          integrity: true,
          disclosure: true,
          withdrawal: false
        },
        publicPerformingRights: {
          holders: [],
          restrictions: []
        },
        mechanicalRights: {
          holders: [],
          statutoryRate: true,
          customRate: null
        }
      }
    },
    recording: {
      performers: [],
      producers: [],
      masterOwner: {
        name: '',
        percentage: 100.0
      },
      rights: {
        neighbouringRights: {
          holders: []
        },
        masterLicenseTerms: {
          allowSampling: true,
          samplingFee: 'Negotiable',
          allowSynchronization: true,
          territorialRestrictions: [],
          exclusivity: false
        },
        performanceRoyalties: {
          streamingRate: 'Standard',
          radioRate: 'Standard',
          publicVenueRate: 'Standard'
        }
      }
    }
  };
  
  // Find track position
  const positionFields = findPossibleFieldValues(track, [
    'position', 'trackNumber', 'number', 'index'
  ]);
  
  if (positionFields.length > 0) {
    formattedTrack.position = parseInt(positionFields[0], 10) || (index + 1);
  }
  
  // Find track title
  const titleFields = findPossibleFieldValues(track, [
    'title', 'name', 'songTitle', 'trackTitle', 'trackName'
  ]);
  
  if (titleFields.length > 0) {
    formattedTrack.title = titleFields[0];
  }
  
  // Find track duration
  const durationFields = findPossibleFieldValues(track, [
    'duration', 'length', 'time', 'trackLength', 'trackDuration'
  ]);
  
  if (durationFields.length > 0) {
    formattedTrack.duration = durationFields[0];
  }
  
  // Find track ISRC
  const isrcFields = findPossibleFieldValues(track, [
    'isrc', 'isrcCode', 'trackIsrc', 'recordingIsrc'
  ]);
  
  if (isrcFields.length > 0) {
    formattedTrack.isrc = isrcFields[0];
  }
  
  // Find track explicit flag
  const explicitFields = findPossibleFieldValues(track, [
    'explicit', 'containsExplicitContent', 'isExplicit', 'explicitContent'
  ]);
  
  if (explicitFields.length > 0) {
    formattedTrack.explicit = !!explicitFields[0];
  }
  
  // Find track language
  const languageFields = findPossibleFieldValues(track, [
    'language', 'songLanguage', 'trackLanguage', 'locale'
  ]);
  
  if (languageFields.length > 0) {
    formattedTrack.language = languageFields[0];
  }
  
  // Find composition data
  const compositionData = findCompositionData(track);
  if (compositionData) {
    formattedTrack.composition = {
      ...formattedTrack.composition,
      ...compositionData
    };
  }
  
  // Find recording data
  const recordingData = findRecordingData(track);
  if (recordingData) {
    formattedTrack.recording = {
      ...formattedTrack.recording,
      ...recordingData
    };
  }
  
  return formattedTrack;
}

function guessAndFillMissingFields(metadata: any, missingFields: string[]): any {
  // Create a copy of the metadata to work with
  const processedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  
  // Ensure basic structure exists for standard format
  if (!processedMetadata.release) {
    processedMetadata.release = {};
  }
  
  if (!processedMetadata.submitter) {
    processedMetadata.submitter = {};
  }
  
  // Ensure tracks array exists
  if (!Array.isArray(processedMetadata.release.tracks)) {
    processedMetadata.release.tracks = [];
  }
  
  // If no tracks, add a default one
  if (processedMetadata.release.tracks.length === 0) {
    processedMetadata.release.tracks.push({});
  }
  
  // Try to guess missing fields by looking for equivalent fields in the metadata
  for (const field of missingFields) {
    const parts = field.split('.');
    
    // Handle release fields
    if (parts[0] === 'release') {
      if (parts.length === 2) {
        // Top-level release fields
        if (parts[1] === 'title') {
          // Look for any field that might contain the release title
          const possibleTitleFields = findPossibleFieldValues(metadata, [
            'albumName', 'album', 'title', 'name', 'albumTitle', 'releaseTitle',
            'albumInfo.name', 'albumInfo.title', 'release.name', 'collection.name'
          ]);
          
          if (possibleTitleFields.length > 0) {
            processedMetadata.release.title = possibleTitleFields[0];
          } else if (processedMetadata.release.tracks && processedMetadata.release.tracks[0] && processedMetadata.release.tracks[0].title) {
            // Guess release title from first track title
            processedMetadata.release.title = processedMetadata.release.tracks[0].title;
          } else {
            processedMetadata.release.title = 'Untitled Release';
          }
        } else if (parts[1] === 'type') {
          // Look for any field that might contain the release type
          const possibleTypeFields = findPossibleFieldValues(metadata, [
            'albumType', 'releaseType', 'type', 'format', 'releaseFormat', 
            'albumInfo.type', 'albumInfo.releaseFormat', 'release.format'
          ]);
          
          if (possibleTypeFields.length > 0) {
            processedMetadata.release.type = mapReleaseType(possibleTypeFields[0]);
          } else {
            // Default to 'album'
            processedMetadata.release.type = 'album';
          }
        } else if (parts[1] === 'releaseDate') {
          // Look for any field that might contain the release date
          const possibleDateFields = findPossibleFieldValues(metadata, [
            'date', 'releaseDate', 'albumDate', 'publishDate', 'publicationDate',
            'albumInfo.releaseDate', 'albumInfo.date', 'release.date'
          ]);
          
          if (possibleDateFields.length > 0) {
            processedMetadata.release.releaseDate = possibleDateFields[0];
          } else {
            // Use current date
            processedMetadata.release.releaseDate = new Date().toISOString().split('T')[0];
          }
        }
      } else if (parts.length > 2 && parts[1] === 'tracks') {
        // Handle track fields
        const trackIndex = parseInt(parts[2].replace(/\D/g, ''), 10);
        if (!isNaN(trackIndex) && trackIndex >= 0) {
          // Ensure we have enough tracks
          while (processedMetadata.release.tracks.length <= trackIndex) {
            processedMetadata.release.tracks.push({});
          }
          
          const track = processedMetadata.release.tracks[trackIndex];
          
          // Look for tracks in alternative formats
          const alternativeTracks = findAlternativeTracks(metadata);
          const alternativeTrack = alternativeTracks[trackIndex] || {};
          
          if (parts.length === 4) {
            if (parts[3] === 'title') {
              // Look for track title in alternative formats
              const possibleTitleFields = findPossibleFieldValues(alternativeTrack, [
                'title', 'name', 'songTitle', 'trackTitle', 'trackName'
              ]);
              
              if (possibleTitleFields.length > 0) {
                track.title = possibleTitleFields[0];
              } else {
                track.title = `Track ${trackIndex + 1}`;
              }
            } else if (parts[3] === 'isrc') {
              // Look for ISRC in alternative formats
              const possibleIsrcFields = findPossibleFieldValues(alternativeTrack, [
                'isrc', 'isrcCode', 'trackIsrc', 'recordingIsrc'
              ]);
              
              if (possibleIsrcFields.length > 0) {
                track.isrc = possibleIsrcFields[0];
              } else {
                // Generate a placeholder ISRC
                track.isrc = `ISRC-PLACEHOLDER-${trackIndex + 1}`;
              }
            } else if (parts[3] === 'composition') {
              // Ensure composition exists
              if (!track.composition) {
                track.composition = {};
                
                // Look for composition data in alternative formats
                const compositionData = findCompositionData(alternativeTrack);
                if (compositionData) {
                  track.composition = compositionData;
                }
              }
            } else if (parts[3] === 'recording') {
              // Ensure recording exists
              if (!track.recording) {
                track.recording = {};
                
                // Look for recording data in alternative formats
                const recordingData = findRecordingData(alternativeTrack);
                if (recordingData) {
                  track.recording = recordingData;
                }
              }
            }
          } else if (parts.length > 4) {
            // Handle nested track fields
            if (parts[3] === 'composition') {
              // Ensure composition exists
              if (!track.composition) {
                track.composition = {};
              }
              
              if (parts[4] === 'writers' && !Array.isArray(track.composition.writers)) {
                // Look for writers in alternative formats
                const writers = findWriters(alternativeTrack);
                if (writers.length > 0) {
                  track.composition.writers = writers;
                } else {
                  track.composition.writers = [{}];
                }
              }
            } else if (parts[3] === 'recording') {
              // Ensure recording exists
              if (!track.recording) {
                track.recording = {};
              }
              
              if (parts[4] === 'performers' && !Array.isArray(track.recording.performers)) {
                // Look for performers in alternative formats
                const performers = findPerformers(alternativeTrack);
                if (performers.length > 0) {
                  track.recording.performers = performers;
                } else {
                  track.recording.performers = [{}];
                }
              }
            }
          }
        }
      }
    }
    
    // Handle submitter fields
    if (parts[0] === 'submitter') {
      if (parts[1] === 'name') {
        // Look for submitter name in alternative formats
        const possibleNameFields = findPossibleFieldValues(metadata, [
          'submitterName', 'submitter.name', 'submitterInfo.name', 'submitterInfo.submitterName',
          'uploader', 'uploaderName', 'creator', 'creatorName', 'user', 'userName'
        ]);
        
        if (possibleNameFields.length > 0) {
          processedMetadata.submitter.name = possibleNameFields[0];
        } else {
          processedMetadata.submitter.name = 'Unknown Submitter';
        }
      } else if (parts[1] === 'role') {
        // Look for submitter role in alternative formats
        const possibleRoleFields = findPossibleFieldValues(metadata, [
          'submitterRole', 'submitter.role', 'submitterInfo.role', 'submitterInfo.submitterRole',
          'uploaderRole', 'creatorRole', 'userRole'
        ]);
        
        if (possibleRoleFields.length > 0) {
          processedMetadata.submitter.role = possibleRoleFields[0];
        } else {
          processedMetadata.submitter.role = 'Creator';
        }
      }
    }
  }
  
  return processedMetadata;
}

// Helper function to find possible field values in the metadata
function findPossibleFieldValues(obj: any, possibleFields: string[]): string[] {
  const values: string[] = [];
  
  if (!obj || typeof obj !== 'object') {
    return values;
  }
  
  // Check each possible field
  for (const field of possibleFields) {
    const parts = field.split('.');
    let value = obj;
    
    // Navigate through nested objects
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }
    
    // If we found a value that's not empty, add it to the list
    if (value !== undefined && value !== null && value !== '') {
      values.push(value);
    }
  }
  
  return values;
}

// Helper function to find alternative tracks in the metadata
function findAlternativeTracks(metadata: any): any[] {
  if (!metadata || typeof metadata !== 'object') {
    return [];
  }
  
  // Look for tracks in various formats
  const possibleTrackArrays = [
    metadata.songs,
    metadata.tracks,
    metadata.albumInfo?.songs,
    metadata.albumInfo?.tracks,
    metadata.release?.tracks,
    metadata.album?.tracks,
    metadata.album?.songs,
    metadata.collection?.tracks,
    metadata.collection?.songs
  ];
  
  // Return the first valid track array we find
  for (const trackArray of possibleTrackArrays) {
    if (Array.isArray(trackArray) && trackArray.length > 0) {
      return trackArray;
    }
  }
  
  return [];
}

// Helper function to find composition data in a track
function findCompositionData(track: any): any {
  if (!track || typeof track !== 'object') {
    return null;
  }
  
  // Look for composition data in various formats
  if (track.composition) {
    return track.composition;
  } else if (track.songwritingInfo) {
    // Convert songwritingInfo to composition format
    return {
      title: track.songwritingInfo.title || track.songTitle || '',
      iswc: track.songwritingInfo.iswcCode || '',
      writers: Array.isArray(track.songwritingInfo.writers) 
        ? track.songwritingInfo.writers.map((writer: any) => ({
            name: writer.fullName || writer.name || '',
            ipi: writer.ipiNumber || writer.ipi || '',
            role: writer.writerRole || writer.role || 'Composer',
            split: writer.percentageShare || writer.split || 100.0,
            publisher: writer.publishingCompany ? {
              name: writer.publishingCompany.companyName || writer.publishingCompany.name || '',
              ipi: writer.publishingCompany.ipiNumber || writer.publishingCompany.ipi || '',
              split: writer.publishingCompany.percentageShare || writer.publishingCompany.split || 50.0
            } : undefined,
            pro: writer.performingRightsOrg || writer.pro || ''
          }))
        : []
    };
  } else if (track.songwriting) {
    // Convert songwriting to composition format
    return {
      title: track.songwriting.title || track.title || '',
      iswc: track.songwriting.iswc || '',
      writers: Array.isArray(track.songwriting.writers) ? track.songwriting.writers : []
    };
  } else if (track.writers || track.composer || track.composers) {
    // Create composition from writers/composers
    const writers = track.writers || (track.composer ? [track.composer] : []) || (track.composers || []);
    return {
      title: track.title || '',
      iswc: track.iswc || '',
      writers: Array.isArray(writers) 
        ? writers.map((writer: any) => {
            if (typeof writer === 'string') {
              return { name: writer, role: 'Composer', split: 100.0 };
            } else {
              return writer;
            }
          })
        : []
    };
  }
  
  // Create a basic composition structure
  return {
    title: track.title || '',
    iswc: '',
    writers: []
  };
}

// Helper function to find recording data in a track
function findRecordingData(track: any): any {
  if (!track || typeof track !== 'object') {
    return null;
  }
  
  // Look for recording data in various formats
  if (track.recording) {
    return track.recording;
  } else if (track.recordingInfo) {
    // Convert recordingInfo to recording format
    return {
      performers: Array.isArray(track.recordingInfo.performers)
        ? track.recordingInfo.performers.map((performer: any) => ({
            name: performer.artistName || performer.name || '',
            isni: performer.isniNumber || performer.isni || '',
            role: performer.performerRole || performer.role || 'MainArtist',
            split: performer.percentageShare || performer.split || 100.0
          }))
        : [],
      producers: Array.isArray(track.recordingInfo.producers)
        ? track.recordingInfo.producers.map((producer: any) => ({
            name: producer.producerName || producer.name || '',
            role: producer.producerRole || producer.role || 'Producer',
            split: producer.percentageShare || producer.split || 5.0
          }))
        : [],
      masterOwner: track.recordingInfo.masterOwnership
        ? {
            name: track.recordingInfo.masterOwnership.ownerName || track.recordingInfo.masterOwnership.name || '',
            percentage: track.recordingInfo.masterOwnership.ownershipPercentage || track.recordingInfo.masterOwnership.percentage || 95.0
          }
        : {
            name: '',
            percentage: 100.0
          }
    };
  } else if (track.performers || track.artists || track.artist) {
    // Create recording from performers/artists
    const performers = track.performers || (track.artists || []) || (track.artist ? [track.artist] : []);
    return {
      performers: Array.isArray(performers)
        ? performers.map((performer: any) => {
            if (typeof performer === 'string') {
              return { name: performer, role: 'MainArtist', split: 100.0 };
            } else {
              return performer;
            }
          })
        : [],
      producers: Array.isArray(track.producers)
        ? track.producers.map((producer: any) => {
            if (typeof producer === 'string') {
              return { name: producer, role: 'Producer', split: 5.0 };
            } else {
              return producer;
            }
          })
        : [],
      masterOwner: track.masterOwner || { name: '', percentage: 100.0 }
    };
  }
  
  // Create a basic recording structure
  return {
    performers: [],
    producers: [],
    masterOwner: { name: '', percentage: 100.0 }
  };
}

// Helper function to find writers in a track
function findWriters(track: any): any[] {
  if (!track || typeof track !== 'object') {
    return [];
  }
  
  // Look for writers in various formats
  if (track.composition && Array.isArray(track.composition.writers)) {
    return track.composition.writers;
  } else if (track.songwritingInfo && Array.isArray(track.songwritingInfo.writers)) {
    return track.songwritingInfo.writers.map((writer: any) => ({
      name: writer.fullName || writer.name || '',
      ipi: writer.ipiNumber || writer.ipi || '',
      role: writer.writerRole || writer.role || 'Composer',
      split: writer.percentageShare || writer.split || 100.0,
      publisher: writer.publishingCompany ? {
        name: writer.publishingCompany.companyName || writer.publishingCompany.name || '',
        ipi: writer.publishingCompany.ipiNumber || writer.publishingCompany.ipi || '',
        split: writer.publishingCompany.percentageShare || writer.publishingCompany.split || 50.0
      } : undefined,
      pro: writer.performingRightsOrg || writer.pro || ''
    }));
  } else if (track.songwriting && Array.isArray(track.songwriting.writers)) {
    return track.songwriting.writers;
  } else if (Array.isArray(track.writers)) {
    return track.writers.map((writer: any) => {
      if (typeof writer === 'string') {
        return { name: writer, role: 'Composer', split: 100.0 };
      } else {
        return writer;
      }
    });
  } else if (Array.isArray(track.composers)) {
    return track.composers.map((composer: any) => {
      if (typeof composer === 'string') {
        return { name: composer, role: 'Composer', split: 100.0 };
      } else {
        return composer;
      }
    });
  } else if (track.composer) {
    if (typeof track.composer === 'string') {
      return [{ name: track.composer, role: 'Composer', split: 100.0 }];
    } else if (typeof track.composer === 'object') {
      return [track.composer];
    }
  }
  
  return [];
}

// Helper function to find performers in a track
function findPerformers(track: any): any[] {
  if (!track || typeof track !== 'object') {
    return [];
  }
  
  // Look for performers in various formats
  if (track.recording && Array.isArray(track.recording.performers)) {
    return track.recording.performers;
  } else if (track.recordingInfo && Array.isArray(track.recordingInfo.performers)) {
    return track.recordingInfo.performers.map((performer: any) => ({
      name: performer.artistName || performer.name || '',
      isni: performer.isniNumber || performer.isni || '',
      role: performer.performerRole || performer.role || 'MainArtist',
      split: performer.percentageShare || performer.split || 100.0
    }));
  } else if (Array.isArray(track.performers)) {
    return track.performers.map((performer: any) => {
      if (typeof performer === 'string') {
        return { name: performer, role: 'MainArtist', split: 100.0 };
      } else {
        return performer;
      }
    });
  } else if (Array.isArray(track.artists)) {
    return track.artists.map((artist: any) => {
      if (typeof artist === 'string') {
        return { name: artist, role: 'MainArtist', split: 100.0 };
      } else {
        return artist;
      }
    });
  } else if (track.artist) {
    if (typeof track.artist === 'string') {
      return [{ name: track.artist, role: 'MainArtist', split: 100.0 }];
    } else if (typeof track.artist === 'object') {
      return [track.artist];
    }
  }
  
  return [];
}

// Helper function to find producers in a track
function findProducers(track: any): any[] {
  if (!track || typeof track !== 'object') {
    return [];
  }
  
  // Look for producers in various formats
  if (track.recording && Array.isArray(track.recording.producers)) {
    return track.recording.producers;
  } else if (track.recordingInfo && Array.isArray(track.recordingInfo.producers)) {
    return track.recordingInfo.producers.map((producer: any) => ({
      name: producer.producerName || producer.name || '',
      role: producer.producerRole || producer.role || 'Producer',
      split: producer.percentageShare || producer.split || 5.0
    }));
  } else if (Array.isArray(track.producers)) {
    return track.producers.map((producer: any) => {
      if (typeof producer === 'string') {
        return { name: producer, role: 'Producer', split: 5.0 };
      } else {
        return producer;
      }
    });
  } else if (track.producer) {
    if (typeof track.producer === 'string') {
      return [{ name: track.producer, role: 'Producer', split: 5.0 }];
    } else if (typeof track.producer === 'object') {
      return [track.producer];
    }
  }
  
  return [];
}

// Configure agent settings
const agentConfig = {
    logger: LogLevel.DEBUG,
    container,
    model,
    extensions: [cli],
    memory: {
      store: createMemoryStore(),
      vector: createChromaVectorStore("derive", "http://localhost:8000"),
    },
    context: goalContexts,
    actions,
    outputs,
};

// Create the agent
const agent = createDreams(agentConfig);

agent.start();
  
