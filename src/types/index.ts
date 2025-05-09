
export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  location: string;
  subscribedServices: string[]; // Array of service names or IDs
  status: 'Active' | 'Inactive';
  lastUpdated: string; // ISO Date string
  contactInfo: {
    email: string;
    phone: string;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  qubeAccountRole: string; 
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

export interface QubeService {
  id: string;
  name: string;
  accessUrl: string;
  subscribedCompaniesCount: number;
  lastUpdated: string; // ISO Date string
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
