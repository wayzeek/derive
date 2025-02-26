/**
 * Processes the raw metadata and returns a processed version
 * @param metadata The raw metadata to process
 * @returns The processed metadata
 */
export function processMetadata(metadata: any): any {
  // Check if metadata is already in the standard format
  if (metadata.release && metadata.submitter) {
    return metadata;
  }
  
  // Create a standard format structure
  const processedMetadata: any = {
    release: {},
    submitter: {}
  };
  
  // Try to extract release information
  if (metadata.album || metadata.title || metadata.release) {
    const releaseSource = metadata.album || metadata.title || metadata.release || {};
    processedMetadata.release = {
      title: releaseSource.title || releaseSource.name || metadata.title || "Unknown Title",
      type: releaseSource.type || metadata.type || "album",
      upc: releaseSource.upc || metadata.upc || "",
      catalogNumber: releaseSource.catalogNumber || metadata.catalogNumber || "",
      releaseDate: releaseSource.releaseDate || metadata.releaseDate || new Date().toISOString().split('T')[0],
      label: releaseSource.label || metadata.label || null,
      genre: Array.isArray(releaseSource.genre) ? releaseSource.genre : 
             (releaseSource.genre ? [releaseSource.genre] : 
             (metadata.genre ? (Array.isArray(metadata.genre) ? metadata.genre : [metadata.genre]) : [])),
      territories: releaseSource.territories || metadata.territories || ["WORLDWIDE"],
      distributionPlatforms: releaseSource.distributionPlatforms || metadata.distributionPlatforms || []
    };
  }
  
  // Try to extract tracks
  processedMetadata.release.tracks = [];
  const tracksSource = metadata.tracks || metadata.songs || 
                      (metadata.album && metadata.album.tracks) || 
                      (metadata.release && metadata.release.tracks) || [];
  
  if (Array.isArray(tracksSource)) {
    processedMetadata.release.tracks = tracksSource.map((track, index) => ({
      position: track.position || track.trackNumber || (index + 1),
      title: track.title || track.name || `Track ${index + 1}`,
      duration: track.duration || "",
      isrc: track.isrc || "",
      explicit: track.explicit || false,
      language: track.language || "en",
      composition: track.composition || {},
      recording: track.recording || {}
    }));
  }
  
  // Try to extract submitter information
  if (metadata.submitter || metadata.user || metadata.creator) {
    const submitterSource = metadata.submitter || metadata.user || metadata.creator || {};
    processedMetadata.submitter = {
      name: submitterSource.name || "Unknown Submitter",
      role: submitterSource.role || "Creator",
      walletAddress: submitterSource.walletAddress || submitterSource.wallet || "",
      email: submitterSource.email || "",
      timestamp: submitterSource.timestamp || new Date().toISOString()
    };
  }
  
  return processedMetadata;
} 