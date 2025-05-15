
import type { Company, User, PortalUser, QubeService, DashboardMetrics, RecentActivity } from '@/types';
import { Building2, UserPlus, ServerCog, ShieldCheck } from 'lucide-react';

const movieStudios = [
    "Warner Bros. Entertainment", "A24 Films", "StudioCanal", "Pixar Animation Studios", 
    "Universal Pictures", "Neon Rated", "Paramount Pictures", "Sony Pictures Entertainment",
    "Walt Disney Studios", "Lionsgate Films", "Focus Features", "Searchlight Pictures",
    "Annapurna Pictures", "Blumhouse Productions", "DreamWorks Animation", "MGM Studios",
    "Legendary Entertainment", "Miramax Films", "Pathé", "Gaumont Film Company"
];

const filmDistributors = [
    "Roadshow Entertainment", "Entertainment One", "STX Entertainment", "IFC Films", 
    "Magnolia Pictures", "Bleecker Street", "The Weinstein Company (historical)", "Summit Entertainment",
    "Open Road Films", "Relativity Media (historical)", "GK Films", "EuropaCorp",
    "FilmNation Entertainment", "Good Universe", "Screen Gems", "TriStar Pictures"
];

const companyNames = [...new Set([...movieStudios, ...filmDistributors])]; // Combine and remove duplicates

const locations = [
    { city: "Burbank", state: "CA", country: "USA" },
    { city: "New York", state: "NY", country: "USA" },
    { city: "Los Angeles", state: "CA", country: "USA" },
    { city: "London", state: "", country: "UK" },
    { city: "Paris", state: "", country: "France" },
    { city: "Toronto", state: "ON", country: "Canada" },
    { city: "Sydney", state: "NSW", country: "Australia" },
    { city: "Emeryville", state: "CA", country: "USA" },
    { city: "Culver City", state: "CA", country: "USA" },
    { city: "Issy-les-Moulineaux", state: "", country: "France" },
];

// Define mockPortalUsers before mockQubeServices if it's used in its definition
export const mockPortalUsers: PortalUser[] = [
  { id: 'pu1', name: 'Peter Pan', email: 'peter.pan@qubecinema.com', role: 'Admin', lastUpdatedOn: new Date().toISOString(), lastUpdatedBy: 'System' },
  { id: 'pu2', name: 'Wendy Darling', email: 'wendy.darling@qubecinema.com', role: 'Company Manager', lastUpdatedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
  { id: 'pu3', name: 'John Doe', email: 'john.doe@qubecinema.com', role: 'Viewer', lastUpdatedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
];

// Define mockQubeServices first
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
  { id: 'qs10', name: 'Qube Account', accessUrl: 'account.qubecinema.com', subscribedCompaniesCount: 0, lastUpdated: new Date().toISOString() }, // Count will be updated
];
mockQubeServices.sort((a, b) => a.name.localeCompare(b.name));


const generateRandomCompanies = (count: number): Company[] => {
    const companies: Company[] = [];
    const usedLegalNames = new Set<string>();

    for (let i = 0; i < count; i++) {
        let legalName = companyNames[i % companyNames.length];
        let attempt = 0;
        let baseLegalName = legalName;
        while(usedLegalNames.has(legalName) && attempt < companyNames.length * 2) {
            legalName = `${baseLegalName} ${attempt + 2}`;
            attempt++;
        }
        usedLegalNames.add(legalName);

        const loc = locations[i % locations.length];
        
        const numServicesToPick = (i % 3) + 1; 
        const baseServices = mockQubeServices
            .filter(s => s.name !== 'Qube Account') 
            .slice(0, numServicesToPick)          
            .map(s => s.name);
        
        const company: Company = {
            id: `${i + 1}`,
            legalName: legalName,
            displayName: legalName, // Can be same as legal name initially
            companyCode: `${legalName.substring(0,3).toUpperCase()}${100+i}`,
            companyUuid: `uuid-${Date.now()}-${i}`,
            logoUrl: `https://placehold.co/100x100.png`,
            data_ai_hint: legalName.split(" ")[0].toLowerCase() + (legalName.split(" ").length > 1 ? " " + legalName.split(" ")[1].toLowerCase() : ""),
            // location: `${loc.city}, ${loc.state ? loc.state + ', ' : ''}${loc.country === 'USA' && loc.state ? '' : loc.country}`, // Removed
            subscribedServices: Array.from(new Set([...baseServices, 'Qube Account'])), 
            status: (i % 10 !== 0) ? 'Active' : 'Inactive', 
            lastUpdated: new Date(Date.now() - (i % 365) * 24 * 60 * 60 * 1000).toISOString(),
            contactInfo: { 
                email: `contact@${legalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, 
                phone: `555-${String(1000 + i).padStart(4, '0')}`,
                website: `https://${legalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
            },
            address: { street: `${100 + i} Main St`, city: loc.city, state: loc.state, zip: `${90000 + i}`, country: loc.country },
            userOnboarding: {
                companyEmailDomains: [`${legalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`, `corp.${legalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`],
                excludedDomains: i % 5 === 0 ? ['gmail.com', 'outlook.com'] : [],
                isExclusiveDomain: i % 2 === 0,
                autoAddUsers: i % 3 === 0,
            },
        };
        companies.push(company);
    }
    return companies;
}

// Now generate mockCompanies
export const mockCompanies: Company[] = generateRandomCompanies(50); // Generate 50 companies for better pagination demo

// Update Qube Account service count
const qubeAccountService = mockQubeServices.find(s => s.id === 'qs10');
if (qubeAccountService) {
    qubeAccountService.subscribedCompaniesCount = mockCompanies.filter(c => c.subscribedServices.includes('Qube Account')).length;
}

// Ensure all companies have "Qube Account" (already handled in generateRandomCompanies, but as a safeguard)
mockCompanies.forEach(company => {
  if (!company.subscribedServices.includes('Qube Account')) {
    company.subscribedServices.push('Qube Account');
  }
});


const firstNames = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nora", "Oscar", "Pamela", "Quentin", "Rachel", "Steven", "Tina", "Usman", "Violet", "Walter", "Xenia", "Yannick", "Zoe"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark"];
const domains = ["example.com", "test.org", "sample.net", "demo.co"];


export const mockCompanyUsers: User[] = Array.from({ length: 40 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${ (i >= firstNames.length || i >= lastNames.length) ? Math.floor(i / firstNames.length) : ''}`;
  
  // Deterministic selection of services for users
  const numServices = (i % 2) + 1; // 1 or 2 services + Qube Account
  const companyServices = mockQubeServices
      .filter(s => s.name !== 'Qube Account')
      .slice(i % mockQubeServices.length, (i % mockQubeServices.length) + numServices) // Cycle through services
      .map(s => s.name);

  return {
    id: `cu${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${emailName}@${domains[i % domains.length]}`,
    associatedServices: Array.from(new Set([...companyServices, 'Qube Account'])), 
    status: (i % 5 !== 0) ? 'Active' : 'Inactive',  // ~80% active
  };
});


export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalUsers: mockCompanyUsers.length + mockPortalUsers.length,
  activeServices: mockQubeServices.filter(s => s.subscribedCompaniesCount > 0).length,
};

export const mockRecentActivities: RecentActivity[] = [
  { id: 'ra1', description: `New company "${mockCompanies[0]?.displayName || 'Sample Company Inc.'}" onboarded.`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'CompanyUpdate', icon: Building2 },
  { id: 'ra2', description: `User ${mockCompanyUsers[0]?.name || 'A User'} added to ${mockCompanies[0]?.displayName || 'Sample Company Inc.'}.`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'UserUpdate', icon: UserPlus },
  { id: 'ra3', description: 'Qube Wire Exhibitor service updated.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), type: 'ServiceSubscription', icon: ServerCog },
  { id: 'ra4', description: 'System maintenance scheduled for tomorrow.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'System', icon: ShieldCheck },
];

// Update recent activities to use the new company names
if (mockCompanies.length > 0 && mockCompanies[0]) { 
    mockRecentActivities[0].description = `New company "${mockCompanies[0].displayName}" onboarded.`;
    if (mockCompanyUsers.length > 0 && mockCompanyUsers[0]) { 
      mockRecentActivities[1].description = `User ${mockCompanyUsers[0].name} added to ${mockCompanies[0].displayName}.`;
    }
}

// Update Qube Account service count based on final data
if (qubeAccountService) {
    qubeAccountService.subscribedCompaniesCount = mockCompanies.length; // All companies subscribe
}
// Update other service counts based on company subscriptions
mockQubeServices.forEach(service => {
  if (service.name !== 'Qube Account') {
    service.subscribedCompaniesCount = mockCompanies.filter(
      company => company.status === 'Active' && company.subscribedServices.includes(service.name)
    ).length;
  }
});

mockQubeServices.sort((a, b) => a.name.localeCompare(b.name)); // Ensure it's sorted finally
