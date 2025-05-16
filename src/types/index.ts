
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

