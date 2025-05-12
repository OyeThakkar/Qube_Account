
import type { Company, User, PortalUser, QubeService, DashboardMetrics, RecentActivity } from '@/types';
import { Building2, UserPlus, ServerCog, ShieldCheck } from 'lucide-react';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Innovatech Solutions',
    logoUrl: 'https://picsum.photos/100/100?random=1',
    location: 'San Francisco, CA',
    subscribedServices: ['Qube Wire Distributor', 'Qube Slate'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'contact@innovatech.com', phone: '555-0101' },
    address: { street: '123 Tech Lane', city: 'San Francisco', state: 'CA', zip: '94107', country: 'USA' },
    billingInfo: 'Net 30, PO #12345',
    deliveryInfo: 'Digital via Qube Wire',
    notes: 'Key client, priority support.',
  },
  {
    id: '2',
    name: 'Synergy Corp',
    logoUrl: 'https://picsum.photos/100/100?random=2',
    location: 'New York, NY',
    subscribedServices: ['Qube Wire Exhibitor', 'iCount', 'MovieBuff Access'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'info@synergy.com', phone: '555-0202' },
    address: { street: '456 Business Ave', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
  },
  {
    id: '3',
    name: 'Future Forward Inc.',
    logoUrl: 'https://picsum.photos/100/100?random=3',
    location: 'Austin, TX',
    subscribedServices: ['Qube Cinemas', 'CinemasDB'],
    status: 'Inactive',
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'support@futureforward.com', phone: '555-0303' },
    address: { street: '789 Innovation Dr', city: 'Austin', state: 'TX', zip: '78701', country: 'USA' },
  },
];

const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nora", "Oscar", "Pamela", "Quentin", "Rachel", "Steven", "Tina", "Usman", "Violet", "Walter", "Xenia", "Yannick", "Zoe"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"];
const domains = ["example.com", "test.org", "sample.net", "demo.co"];

// Define mockPortalUsers before mockQubeServices if it's used in its definition
export const mockPortalUsers: PortalUser[] = [
  { id: 'pu1', name: 'Peter Pan', email: 'peter.pan@qubecinema.com', role: 'Admin', lastUpdatedOn: new Date().toISOString(), lastUpdatedBy: 'System' },
  { id: 'pu2', name: 'Wendy Darling', email: 'wendy.darling@qubecinema.com', role: 'Company Manager', lastUpdatedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
  { id: 'pu3', name: 'John Doe', email: 'john.doe@qubecinema.com', role: 'Viewer', lastUpdatedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
];

// Now define mockQubeServices, it can safely access mockPortalUsers.length
export let mockQubeServices: QubeService[] = [
  { id: 'qs1', name: 'Qube Wire Distributor', accessUrl: 'distributor.qubewire.com', subscribedCompaniesCount: 25, lastUpdated: new Date().toISOString() },
  { id: 'qs2', name: 'Qube Wire Exhibitor', accessUrl: 'exhibitor.qubewire.com', subscribedCompaniesCount: 150, lastUpdated: new Date().toISOString() },
  { id: 'qs3', name: 'Qube Wire Partner', accessUrl: 'partner.qubewire.com', subscribedCompaniesCount: 10, lastUpdated: new Date().toISOString() },
  { id: 'qs4', name: 'Qube Wire Admin', accessUrl: 'admin.qubewire.com', subscribedCompaniesCount: 5, lastUpdated: new Date().toISOString() },
  { id: 'qs5', name: 'Qube Slate', accessUrl: 'qubeslate.com', subscribedCompaniesCount: 80, lastUpdated: new Date().toISOString() },
  { id: 'qs6', name: 'CinemasDB', accessUrl: 'cinemasdb.qubewire.com/admin', subscribedCompaniesCount: 40, lastUpdated: new Date().toISOString() },
  { id: 'qs7', name: 'iCount', accessUrl: 'app.icount.com', subscribedCompaniesCount: 200, lastUpdated: new Date().toISOString() },
  { id: 'qs8', name: 'MovieBuff Access', accessUrl: 'access.moviebuff.com', subscribedCompaniesCount: 120, lastUpdated: new Date().toISOString() },
  { id: 'qs9', name: 'Qube Cinemas', accessUrl: 'notpublic.qubecinema.com', subscribedCompaniesCount: 30, lastUpdated: new Date().toISOString() },
  { id: 'qs10', name: 'Qube Account', accessUrl: 'account.qubecinema.com', subscribedCompaniesCount: mockCompanies.length + mockPortalUsers.length, lastUpdated: new Date().toISOString() },
];
mockQubeServices.sort((a, b) => a.name.localeCompare(b.name));


export const mockCompanyUsers: User[] = Array.from({ length: 40 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.random() > 0.5 ? i : ''}`;
  const numServices = Math.floor(Math.random() * 3) + 1; // 1 to 3 services
  // Ensure mockQubeServices is fully defined and sorted before using it here
  const companyServices = [...mockQubeServices].sort(() => 0.5 - Math.random()).slice(0, numServices).map(s => s.name);
  
  return {
    id: `cu${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${emailName}@${domains[Math.floor(Math.random() * domains.length)]}`,
    associatedServices: companyServices,
    status: Math.random() > 0.2 ? 'Active' : 'Inactive', // 80% active
  };
});


export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalUsers: mockCompanyUsers.length + mockPortalUsers.length,
  activeServices: mockQubeServices.filter(s => s.subscribedCompaniesCount > 0).length,
};

export const mockRecentActivities: RecentActivity[] = [
  { id: 'ra1', description: 'New company "Innovatech Solutions" onboarded.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'CompanyUpdate', icon: Building2 },
  { id: 'ra2', description: `User ${mockCompanyUsers[0].name} added to Innovatech.`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'UserUpdate', icon: UserPlus },
  { id: 'ra3', description: 'Qube Wire Exhibitor service updated.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), type: 'ServiceSubscription', icon: ServerCog },
  { id: 'ra4', description: 'System maintenance scheduled for tomorrow.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'System', icon: ShieldCheck },
];

