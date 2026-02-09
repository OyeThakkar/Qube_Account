import { CPLMetadata, UploadedCPL, PodConfiguration, DCPPackage, Aspect, CPLReel, CPLAsset } from '@/types';
import { createHash } from 'crypto';

/**
 * Parse CPL XML content and extract metadata
 */
export function parseCPLXML(xmlContent: string, fileName: string): CPLMetadata {
  // Note: In a real implementation, this would use a proper XML parser
  // For now, we'll extract key information using regex patterns
  
  const getXMLValue = (tag: string, content: string): string => {
    const match = content.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`));
    return match ? match[1].trim() : '';
  };

  const uuid = getXMLValue('Id', xmlContent) || getXMLValue('UUID', xmlContent);
  const contentTitle = getXMLValue('ContentTitleText', xmlContent) || getXMLValue('Title', xmlContent);
  const editRate = getXMLValue('EditRate', xmlContent);
  
  // Determine aspect ratio from content
  const aspectMatch = xmlContent.match(/<ScreenAspectRatio>([^<]+)<\/ScreenAspectRatio>/);
  let aspect: Aspect = 'Flat';
  if (aspectMatch) {
    const ratio = parseFloat(aspectMatch[1]);
    aspect = ratio > 2.0 ? 'Scope' : 'Flat';
  }

  // Check encryption
  const encrypted = xmlContent.includes('<Encrypted>true</Encrypted>') || 
                    xmlContent.includes('<KeyId>') ||
                    xmlContent.includes('<CipherAlgorithm>');

  // Parse reels
  const reels: CPLReel[] = [];
  const reelMatches = xmlContent.matchAll(/<Reel>([\s\S]*?)<\/Reel>/g);
  
  let reelIndex = 0;
  for (const reelMatch of reelMatches) {
    const reelContent = reelMatch[1];
    const reelId = getXMLValue('Id', reelContent) || `reel-${reelIndex}`;
    
    const assets: CPLAsset[] = [];
    const assetMatches = reelContent.matchAll(/<Id>([^<]+)<\/Id>/g);
    
    for (const assetMatch of assetMatches) {
      if (assetMatch[1] !== reelId) { // Skip reel ID itself
        assets.push({
          uuid: assetMatch[1],
        });
      }
    }

    reels.push({
      id: `reel-${reelIndex}`,
      uuid: reelId,
      assets,
      editRate,
    });
    
    reelIndex++;
  }

  return {
    uuid,
    contentTitle: contentTitle || fileName,
    editRate: editRate || '24 1',
    aspect,
    encrypted,
    reels,
  };
}

/**
 * Validate CPL compatibility across multiple CPLs
 */
export function validateCPLCompatibility(cpls: UploadedCPL[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (cpls.length === 0) {
    return { valid: false, errors: ['No CPLs provided'] };
  }

  if (cpls.length > 20) {
    errors.push('Maximum of 20 CPLs allowed per pod');
  }

  // Check for duplicates
  const uuids = cpls.map(cpl => cpl.metadata.uuid);
  const duplicates = uuids.filter((uuid, index) => uuids.indexOf(uuid) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate CPL UUIDs found: ${duplicates.join(', ')}`);
  }

  // Get reference values from first CPL
  const referenceCPL = cpls[0].metadata;
  const referenceEditRate = referenceCPL.editRate;
  const referenceAspect = referenceCPL.aspect;

  // Validate all CPLs against reference
  for (let i = 0; i < cpls.length; i++) {
    const cpl = cpls[i].metadata;
    const cplIdentifier = `CPL ${i + 1} (${cpl.contentTitle})`;

    // Check encryption
    if (cpl.encrypted) {
      errors.push(`${cplIdentifier}: CPL is encrypted. Only unencrypted CPLs are supported.`);
    }

    // Check edit rate
    if (cpl.editRate !== referenceEditRate) {
      errors.push(`${cplIdentifier}: Edit rate mismatch. Expected ${referenceEditRate}, got ${cpl.editRate}`);
    }

    // Check aspect ratio
    if (cpl.aspect !== referenceAspect) {
      errors.push(`${cplIdentifier}: Aspect ratio mismatch. Expected ${referenceAspect}, got ${cpl.aspect}`);
    }

    // Check reels exist
    if (!cpl.reels || cpl.reels.length === 0) {
      errors.push(`${cplIdentifier}: No reels found in CPL`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate deterministic pod ID from configuration
 */
export function generatePodId(config: PodConfiguration): string {
  // Format: THEATERID_RATING_SECTION_ASPECT_dd-mmm-yyyy
  const ratingFormatted = config.rating.replace('-', '');
  const podName = `${config.theatreId}_${ratingFormatted}_${config.section}_${config.aspect.toUpperCase()}_${config.startDate}`;
  
  return podName;
}

/**
 * Generate deterministic hash for pod based on configuration
 */
export function generatePodHash(config: PodConfiguration): string {
  const hashInput = [
    config.theatreId,
    config.rating,
    config.section,
    config.aspect,
    config.startDate,
    ...config.cpls.map(cpl => cpl.metadata.uuid).sort(), // Sort for determinism
  ].join('|');

  // In browser environment, we'll use a simple hash
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Stitch multiple CPLs into a single unified CPL
 */
export function stitchCPLs(cpls: UploadedCPL[], config: PodConfiguration): CPLMetadata {
  const podId = generatePodId(config);
  const podHash = generatePodHash(config);
  const podUUID = `urn:uuid:${podHash}-0000-0000-0000-000000000000`;

  // Combine all reels from all CPLs in order
  const allReels: CPLReel[] = [];
  let reelCounter = 1;

  for (const cpl of cpls) {
    for (const reel of cpl.metadata.reels) {
      // Create new reel with new UUID but preserve asset references
      const newReel: CPLReel = {
        id: `reel-${reelCounter}`,
        uuid: `urn:uuid:${podHash}-reel-${reelCounter.toString().padStart(4, '0')}`,
        assets: [...reel.assets], // Preserve original asset UUIDs
        duration: reel.duration,
        editRate: reel.editRate,
      };
      allReels.push(newReel);
      reelCounter++;
    }
  }

  const stitchedCPL: CPLMetadata = {
    uuid: podUUID,
    contentTitle: podId,
    editRate: cpls[0].metadata.editRate,
    aspect: cpls[0].metadata.aspect,
    encrypted: false,
    reels: allReels,
    issueDate: new Date().toISOString(),
    creator: 'Qube Ad Pod Compiler',
  };

  return stitchedCPL;
}

/**
 * Generate ASSETMAP.xml content
 */
export function generateAssetMap(cpl: CPLMetadata, mxfReferences: string[]): string {
  const assetMapXML = `<?xml version="1.0" encoding="UTF-8"?>
<AssetMap xmlns="http://www.smpte-ra.org/schemas/429-9/2007/AM">
  <Id>${cpl.uuid}</Id>
  <Creator>${cpl.creator || 'Qube Ad Pod Compiler'}</Creator>
  <VolumeCount>1</VolumeCount>
  <IssueDate>${cpl.issueDate || new Date().toISOString()}</IssueDate>
  <Issuer>Qube Cinema</Issuer>
  <AssetList>
    <Asset>
      <Id>${cpl.uuid}</Id>
      <PackingList>true</PackingList>
      <ChunkList>
        <Chunk>
          <Path>PKL_${cpl.contentTitle}.xml</Path>
          <VolumeIndex>1</VolumeIndex>
          <Offset>0</Offset>
          <Length>0</Length>
        </Chunk>
      </ChunkList>
    </Asset>
    <Asset>
      <Id>${cpl.uuid}</Id>
      <ChunkList>
        <Chunk>
          <Path>CPL_${cpl.contentTitle}.xml</Path>
          <VolumeIndex>1</VolumeIndex>
          <Offset>0</Offset>
          <Length>0</Length>
        </Chunk>
      </ChunkList>
    </Asset>
${mxfReferences.map(mxf => `    <Asset>
      <Id>${mxf}</Id>
      <ChunkList>
        <Chunk>
          <Path>${mxf}.mxf</Path>
          <VolumeIndex>1</VolumeIndex>
          <Offset>0</Offset>
          <Length>0</Length>
        </Chunk>
      </ChunkList>
    </Asset>`).join('\n')}
  </AssetList>
</AssetMap>`;

  return assetMapXML;
}

/**
 * Generate PKL.xml content
 */
export function generatePKL(cpl: CPLMetadata, mxfReferences: string[]): string {
  const pklXML = `<?xml version="1.0" encoding="UTF-8"?>
<PackingList xmlns="http://www.smpte-ra.org/schemas/429-8/2007/PKL">
  <Id>${cpl.uuid}</Id>
  <IssueDate>${cpl.issueDate || new Date().toISOString()}</IssueDate>
  <Issuer>Qube Cinema</Issuer>
  <Creator>${cpl.creator || 'Qube Ad Pod Compiler'}</Creator>
  <AssetList>
    <Asset>
      <Id>${cpl.uuid}</Id>
      <Type>text/xml</Type>
      <OriginalFileName>CPL_${cpl.contentTitle}.xml</OriginalFileName>
      <Size>0</Size>
      <Hash>0000000000000000000000000000000000000000</Hash>
    </Asset>
${mxfReferences.map(mxf => `    <Asset>
      <Id>${mxf}</Id>
      <Type>application/mxf</Type>
      <OriginalFileName>${mxf}.mxf</OriginalFileName>
      <Size>0</Size>
      <Hash>0000000000000000000000000000000000000000</Hash>
    </Asset>`).join('\n')}
  </AssetList>
</PackingList>`;

  return pklXML;
}

/**
 * Generate CPL.xml content
 */
export function generateCPLXML(cpl: CPLMetadata): string {
  const cplXML = `<?xml version="1.0" encoding="UTF-8"?>
<CompositionPlaylist xmlns="http://www.smpte-ra.org/schemas/2067-3/2016">
  <Id>${cpl.uuid}</Id>
  <IssueDate>${cpl.issueDate || new Date().toISOString()}</IssueDate>
  <Issuer>Qube Cinema</Issuer>
  <Creator>${cpl.creator || 'Qube Ad Pod Compiler'}</Creator>
  <ContentTitleText>${cpl.contentTitle}</ContentTitleText>
  <ContentKind>advertisement</ContentKind>
  <ContentVersion>
    <Id>${cpl.uuid}-version</Id>
    <LabelText>${cpl.contentTitle} Version 1</LabelText>
  </ContentVersion>
  <EditRate>${cpl.editRate}</EditRate>
  <ReelList>
${cpl.reels.map((reel, index) => `    <Reel>
      <Id>${reel.uuid}</Id>
      <AssetList>
${reel.assets.map(asset => `        <Asset>
          <Id>${asset.uuid}</Id>
        </Asset>`).join('\n')}
      </AssetList>
    </Reel>`).join('\n')}
  </ReelList>
</CompositionPlaylist>`;

  return cplXML;
}

/**
 * Generate complete DCP package
 */
export function generateDCPPackage(config: PodConfiguration): DCPPackage {
  // Validate CPLs
  const validation = validateCPLCompatibility(config.cpls);
  if (!validation.valid) {
    throw new Error(`CPL validation failed: ${validation.errors.join(', ')}`);
  }

  // Stitch CPLs
  const stitchedCPL = stitchCPLs(config.cpls, config);

  // Extract all MXF references from reels
  const mxfReferences: string[] = [];
  for (const reel of stitchedCPL.reels) {
    for (const asset of reel.assets) {
      if (!mxfReferences.includes(asset.uuid)) {
        mxfReferences.push(asset.uuid);
      }
    }
  }

  const podName = generatePodId(config);

  return {
    podName,
    assetMap: generateAssetMap(stitchedCPL, mxfReferences),
    pkl: generatePKL(stitchedCPL, mxfReferences),
    cpl: generateCPLXML(stitchedCPL),
    mxfReferences,
  };
}

/**
 * Format date to dd-mmm-yyyy format
 */
export function formatPodDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Parse date from dd-mmm-yyyy format
 */
export function parsePodDate(dateStr: string): Date {
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected dd-mmm-yyyy');
  }
  
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  
  if (month === undefined) {
    throw new Error('Invalid month. Expected Jan, Feb, Mar, etc.');
  }
  
  return new Date(year, month, day);
}
