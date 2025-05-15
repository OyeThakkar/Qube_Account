
import type { Company, User, PortalUser, QubeService, DashboardMetrics, RecentActivity } from '@/types';
import { Building2, UserPlus, ServerCog, ShieldCheck } from 'lucide-react';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Warner Bros. Entertainment',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'Burbank, CA',
    subscribedServices: ['Qube Wire Distributor', 'Qube Slate', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'contact@warnerbros.com', phone: '555-0101' },
    address: { street: '4000 Warner Blvd', city: 'Burbank', state: 'CA', zip: '91522', country: 'USA' },
    billingInfo: 'Net 30, PO #WBE12345',
    deliveryInfo: 'Digital via Qube Wire, Physical to WH',
    notes: 'Major studio partner.',
    data_ai_hint: 'movie studio'
  },
  {
    id: '2',
    name: 'A24 Films',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'New York, NY',
    subscribedServices: ['Qube Wire Exhibitor', 'iCount', 'MovieBuff Access', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'info@a24films.com', phone: '555-0202' },
    address: { street: '31 W 27th St', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
    data_ai_hint: 'indie film'
  },
  {
    id: '3',
    name: 'StudioCanal',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'Issy-les-Moulineaux, France',
    subscribedServices: ['Qube Cinemas', 'CinemasDB', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'acquisition@studiocanal.com', phone: '+33 1 71 35 35 35' },
    address: { street: '1 Place du Spectacle', city: 'Issy-les-Moulineaux', state: 'N/A', zip: '92130', country: 'France' },
    notes: 'Leading European film distributor.',
    data_ai_hint: 'european cinema'
  },
  {
    id: '4',
    name: 'Pixar Animation Studios',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'Emeryville, CA',
    subscribedServices: ['Qube Wire Distributor', 'Qube Slate', 'iCount', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'production@pixar.com', phone: '555-0404' },
    address: { street: '1200 Park Ave', city: 'Emeryville', state: 'CA', zip: '94608', country: 'USA' },
    billingInfo: 'Net 60',
    deliveryInfo: 'Digital only',
    data_ai_hint: 'animation studio'
  },
  {
    id: '5',
    name: 'Roadshow Entertainment',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'Sydney, AU',
    subscribedServices: ['MovieBuff Access', 'CinemasDB', 'Qube Account'],
    status: 'Inactive',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'contact@roadshow.com.au', phone: '+61 2 9552 8600' },
    address: { street: 'Village Roadshow Centre, Level 1, 235 Pyrmont Street', city: 'Pyrmont', state: 'NSW', zip: '2009', country: 'Australia' },
    notes: 'Major Australian distributor.',
    data_ai_hint: 'film distributor'
  },
  {
    id: '6',
    name: 'Universal Pictures',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'Universal City, CA',
    subscribedServices: ['Qube Wire Distributor', 'Qube Cinemas', 'iCount', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'guestrelations@nbcuni.com', phone: '555-0505' },
    address: { street: '100 Universal City Plaza', city: 'Universal City', state: 'CA', zip: '91608', country: 'USA' },
    notes: 'One of the "Big Five" studios.',
    data_ai_hint: 'major studio'
  },
  {
    id: '7',
    name: 'Neon Rated',
    logoUrl: 'https://placehold.co/100x100.png',
    location: 'New York, NY',
    subscribedServices: ['Qube Wire Exhibitor', 'MovieBuff Access', 'Qube Account'],
    status: 'Active',
    lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    contactInfo: { email: 'info@neonrated.com', phone: '555-0606' },
    address: { street: '580 Broadway', city: 'New York', state: 'NY', zip: '10012', country: 'USA' },
    notes: 'Distributor of acclaimed independent films.',
    data_ai_hint: 'indie distributor'
  }
].map(company => ({
    ...company,
    subscribedServices: Array.from(new Set([...company.subscribedServices, 'Qube Account']))
}));

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
    associatedServices: Array.from(new Set([...companyServices, 'Qube Account'])), // Ensure Qube Account is always present
    status: Math.random() > 0.2 ? 'Active' : 'Inactive', // 80% active
  };
});


export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalUsers: mockCompanyUsers.length + mockPortalUsers.length,
  activeServices: mockQubeServices.filter(s => s.subscribedCompaniesCount > 0).length,
};

export const mockRecentActivities: RecentActivity[] = [
  { id: 'ra1', description: `New company "Warner Bros. Entertainment" onboarded.`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'CompanyUpdate', icon: Building2 },
  { id: 'ra2', description: `User ${mockCompanyUsers[0]?.name || 'A User'} added to Warner Bros. Entertainment.`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'UserUpdate', icon: UserPlus },
  { id: 'ra3', description: 'Qube Wire Exhibitor service updated.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), type: 'ServiceSubscription', icon: ServerCog },
  { id: 'ra4', description: 'System maintenance scheduled for tomorrow.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'System', icon: ShieldCheck },
];

// Update recent activities to use the new company names
if (mockCompanies.length > 0 && mockCompanies[0]) { // Check if mockCompanies[0] exists
    mockRecentActivities[0].description = `New company "${mockCompanies[0].name}" onboarded.`;
    if (mockCompanyUsers.length > 0 && mockCompanyUsers[0]) { // Check if mockCompanyUsers[0] exists
      mockRecentActivities[1].description = `User ${mockCompanyUsers[0].name} added to ${mockCompanies[0].name}.`;
    }
}
