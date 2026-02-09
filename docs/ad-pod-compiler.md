# Ad Pod Compiler Documentation

## Overview

The Ad Pod Compiler is a deterministic, upstream-controlled system for creating weekly ad pods for theatres. It eliminates the risk of ad reordering at the theatre level by stitching individual ad CPLs into a single unified DCP package.

## Features

### Core Functionality

1. **Deterministic Pod Creation**
   - Guaranteed ad playback order locked at media layer
   - Idempotent generation (same inputs = same pod)
   - No runtime flexibility trade-off for execution certainty

2. **CPL Stitching**
   - Physical stitching of multiple CPLs into one unified CPL
   - Preserves original asset references (no media transcoding)
   - Pure metadata-level operation

3. **Validation Layer**
   - Cross-CPL compatibility validation
   - Edit rate consistency checking
   - Aspect ratio matching (Flat/Scope)
   - Encryption detection (only unencrypted CPLs supported)
   - Duplicate prevention

4. **DCP Package Generation**
   - Complete DCP package with ASSETMAP.xml, PKL.xml, and CPL.xml
   - SHA-1 hash placeholders for integrity verification
   - All MXF references preserved

### Pod Identity

**Naming Format:**
```
<THEATERID>_<RATING>_<SECTION>_<ASPECT>_<dd-mmm-yyyy>
```

**Example:**
```
T1042_PG13_LPS_FLAT_06-Feb-2026
```

**Rules:**
- Uppercase formatting
- PG-13 → PG13 conversion
- Deterministic hash generation from configuration
- No timestamp inclusion for idempotency

### Supported Parameters

#### Theatre Configuration
- **Theatre Name**: Human-readable theatre name
- **Theatre ID**: Unique theatre identifier (e.g., T1042)

#### Content Parameters
- **Rating**: G, PG, PG-13, R
- **Section**: LPS (Late Pre-Show), EPS (Early Pre-Show)
- **Aspect Ratio**: Flat (1.85:1), Scope (2.39:1)
- **Start Date**: dd-mmm-yyyy format (e.g., 06-Feb-2026)

#### CPL Upload
- **Maximum**: 20 CPLs per pod
- **Order**: Upload order = playback order
- **Format**: XML files only
- **Requirements**: 
  - Unencrypted only
  - Same edit rate across all CPLs
  - Same aspect ratio across all CPLs

## User Interface

### Main Page
- Empty state with "Create Ad Pod" call-to-action
- Pod list table showing:
  - Pod name
  - Theatre information
  - Configuration details
  - CPL count
  - Status badge
  - Created timestamp
  - Actions (View, Download, Delete)

### Pod Creation Wizard

#### Step 1: Configuration
- Theatre name and ID input
- Rating selection
- Section selection (LPS/EPS)
- Aspect ratio selection
- Start date input

#### Step 2: CPL Upload
- Drag-and-drop file upload area
- Ordered list of uploaded CPLs
- Individual CPL metadata display
- Remove CPL capability
- Validation errors display

#### Step 3: Validation & Generation
- Validation summary
- Pod configuration review
- Generated pod name preview
- Generate button
- Download DCP package

### Pod Details Dialog
- Complete pod configuration
- CPL order and details
- Reel information
- Metadata (Created, Generated timestamps)
- Error messages (if any)

## Technical Implementation

### Core Files

- **`src/app/ad-pods/page.tsx`** - Main page component
- **`src/components/ad-pods/pod-creation-dialog.tsx`** - Multi-step creation wizard
- **`src/components/ad-pods/pod-list-table.tsx`** - Pod management table
- **`src/components/ad-pods/pod-details-dialog.tsx`** - Pod details viewer
- **`src/lib/ad-pod-utils.ts`** - Core utilities for CPL parsing, validation, and generation
- **`src/types/index.ts`** - TypeScript type definitions

### Implementation Notes

#### CPL Parsing
The current implementation uses regex-based XML parsing for simplicity. For production use, consider:
- Implementing a proper XML parser (e.g., fast-xml-parser, xml2js)
- Adding comprehensive error handling
- Supporting more CPL variants and edge cases

#### DCP Package Generation
The generated DCP packages include placeholder values for:
- **File Sizes** - Set to 0 in ASSETMAP and PKL
- **SHA-1 Hashes** - Set to placeholder in PKL
- **File Offsets** - Set to 0 in ASSETMAP

For production deployment, these should be computed from actual MXF files:
```typescript
// Example: Compute actual file hash
const actualHash = await computeSHA1Hash(mxfFilePath);

// Example: Get actual file size
const actualSize = await getFileSize(mxfFilePath);
```

#### Browser Limitations
All cryptographic operations use browser-compatible implementations. The hash generation for pod IDs uses a simple string-based hash function suitable for deterministic naming but not cryptographic security.

### Key Functions

#### CPL Parsing
```typescript
parseCPLXML(xmlContent: string, fileName: string): CPLMetadata
```
Extracts metadata from CPL XML including UUID, edit rate, aspect ratio, encryption status, and reel structure.

#### Validation
```typescript
validateCPLCompatibility(cpls: UploadedCPL[]): { valid: boolean; errors: string[] }
```
Validates CPL compatibility across edit rate, aspect ratio, encryption, and duplicate detection.

#### Pod ID Generation
```typescript
generatePodId(config: PodConfiguration): string
```
Creates deterministic pod name following the naming convention.

#### CPL Stitching
```typescript
stitchCPLs(cpls: UploadedCPL[], config: PodConfiguration): CPLMetadata
```
Combines multiple CPLs into a single unified CPL while preserving asset references.

#### DCP Generation
```typescript
generateDCPPackage(config: PodConfiguration): DCPPackage
```
Generates complete DCP package including ASSETMAP, PKL, and CPL XML files.

## Operational Model

### Weekly Cadence
- Ads assigned per theatre weekly
- Batch compilation job generates pods
- Distribution over weekend
- Monday activation

### Scale Characteristics
For 1,500 theatres:
- 1,500 pods per week
- No KDM generation (unencrypted ads)
- Fully deterministic
- Predictable batch workload

## Advantages

1. **Guaranteed Order** - Playback sequence locked at media layer
2. **Atomic Scheduling** - Theatre schedules one composition, not components
3. **Clean Proof-of-Play** - If pod plays, all ads inside played in order
4. **No Crypto Overhead** - Unencrypted ads eliminate KDM complexity
5. **Deterministic & Idempotent** - Same inputs always produce same pod
6. **Upstream Enforcement** - Execution integrity independent of theatre automation

## Trade-offs

| Trade-off | Impact | Mitigation |
|-----------|--------|------------|
| Loss of runtime flexibility | Mid-week changes require regeneration | Weekly cadence acceptable for ad delivery |
| More DCP objects | One per theatre per week | Manageable with lifecycle cleanup |
| Storage growth | Linear with theatre count | Automated cleanup of old pods |

## Future Enhancements

1. **Batch Pod Creation** - Generate multiple pods at once
2. **Template System** - Save and reuse common configurations
3. **Asset Management Integration** - Direct integration with asset repository
4. **KDM Support** - Optional encryption for premium content
5. **Scheduling Integration** - Direct deployment to theatre automation systems
6. **Analytics Dashboard** - Pod delivery and playback statistics
7. **Version Control** - Track pod revisions and changes
8. **API Integration** - RESTful API for programmatic access

## Known Limitations

### Current Implementation

1. **XML Parsing** - Uses regex-based parsing instead of a full XML parser. May not handle all CPL variants.
2. **Placeholder Values** - Generated DCP packages use placeholder values for file sizes and SHA-1 hashes. These must be computed from actual MXF files for production use.
3. **No File Validation** - Does not verify that referenced MXF files actually exist in the asset repository.
4. **Memory Constraints** - Large CPL files (>10MB) may cause performance issues in the browser.
5. **No Batch Operations** - Must create pods one at a time.
6. **Client-Side Only** - All processing happens in the browser; no server-side validation or storage.

### Production Considerations

For production deployment, implement:
- Server-side CPL processing with proper XML parser
- Actual SHA-1 hash computation from MXF files
- File size determination from asset repository
- Asset existence verification
- Database storage for pod configurations
- Background job processing for large batches
- Integration with content delivery network (CDN)

## Troubleshooting

### Common Issues

**CPL Validation Fails**
- Ensure all CPLs have the same edit rate
- Verify all CPLs have matching aspect ratios
- Check that no CPLs are encrypted
- Remove any duplicate CPLs

**Upload Issues**
- Ensure files are valid XML
- Check file size (should be under 10MB per CPL)
- Verify XML structure matches DCP CPL schema

**Generation Errors**
- Verify all required fields are filled
- Ensure at least one CPL is uploaded
- Check that date format is dd-mmm-yyyy
- Validate theatre ID format

## Support

For technical support or feature requests, please contact the development team or file an issue in the repository.
