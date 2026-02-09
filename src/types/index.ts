
export interface Company {
  id: string;
  legalName: string; // Renamed from name
  displayName: string;
  companyCode: string;
  companyUuid: string;
  logoUrl?: string;
  // location: string; // Removed, as address has city/state/country
  subscribedServices: string[]; // Array of service names or IDs
  status: 'Active' | 'Inactive';
  lastUpdated: string; // ISO Date string
  contactInfo: {
    email: string;
    phone: string;
    website?: string; // Added
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingInfo?: string;
  deliveryInfo?: string;
  notes?: string;
  userOnboarding?: {
    companyEmailDomains: string[];
    excludedDomains: string[];
    isExclusiveDomain: boolean;
    autoAddUsers: boolean;
  };
  data_ai_hint?: string; // Keep for logo generation hint
}

export interface User {
  id: string;
  name: string;
  email: string;
  associatedServices: string[]; // List of service names user is associated with
  status: 'Active' | 'Inactive';
}

export interface PortalUser {
  id:string;
  name: string;
  email: string;
  role: 'Admin' | 'Company Manager' | 'Viewer';
  lastUpdatedOn: string; // ISO Date string
  lastUpdatedBy: string; // User name or ID
}

export interface ServiceRole {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  updatedOn: string; // ISO Date string
  updatedBy: string; // User name or ID
}

export interface QubeService {
  id: string;
  name: string;
  accessUrl: string;
  subscribedCompaniesCount: number;
  lastUpdated: string; // ISO Date string
  description?: string;
  uuid?: string;
  clientId?: string;
  token?: string; // This should be handled securely in a real app
  roles?: ServiceRole[];
}

export interface DashboardMetrics {
  totalCompanies: number;
  totalUsers: number;
  activeServices: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  timestamp: string; // ISO Date string
  user?: string;
  type: 'CompanyUpdate' | 'UserUpdate' | 'ServiceSubscription' | 'System';
  icon?: React.ElementType;
}

// Ad Pod Compiler Types
export type Rating = 'G' | 'PG' | 'PG-13' | 'R';
export type Section = 'LPS' | 'EPS';
export type Aspect = 'Flat' | 'Scope';

export interface CPLAsset {
  uuid: string;
  path?: string;
  hash?: string;
}

export interface CPLReel {
  id: string;
  uuid: string;
  assets: CPLAsset[];
  duration?: string;
  editRate?: string;
}

export interface CPLMetadata {
  uuid: string;
  contentTitle: string;
  editRate: string;
  aspect: Aspect;
  audioChannels?: number;
  encrypted: boolean;
  reels: CPLReel[];
  issueDate?: string;
  creator?: string;
}

export interface UploadedCPL {
  id: string;
  fileName: string;
  metadata: CPLMetadata;
  order: number;
  validated: boolean;
  validationErrors: string[];
}

export interface PodConfiguration {
  theatreName: string;
  theatreId: string;
  rating: Rating;
  section: Section;
  aspect: Aspect;
  startDate: string; // dd-mmm-yyyy format
  cpls: UploadedCPL[];
}

export interface AdPod {
  id: string;
  podName: string;
  configuration: PodConfiguration;
  status: 'draft' | 'validated' | 'generated' | 'failed';
  generatedCPL?: CPLMetadata;
  createdAt: string;
  generatedAt?: string;
  errorMessage?: string;
}

export interface DCPPackage {
  podName: string;
  assetMap: string; // XML content
  pkl: string; // XML content
  cpl: string; // XML content
  mxfReferences: string[]; // List of MXF file paths
}

