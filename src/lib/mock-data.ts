
import type { Company, User, PortalUser, QubeService, DashboardMetrics, RecentActivity, ServiceRole } from '@/types';
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

export const mockPortalUsers: PortalUser[] = [
  { id: 'pu1', name: 'Peter Pan', email: 'peter.pan@qubecinema.com', role: 'Admin', lastUpdatedOn: new Date().toISOString(), lastUpdatedBy: 'System' },
  { id: 'pu2', name: 'Wendy Darling', email: 'wendy.darling@qubecinema.com', role: 'Company Manager', lastUpdatedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
  { id: 'pu3', name: 'John Doe', email: 'john.doe@qubecinema.com', role: 'Viewer', lastUpdatedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), lastUpdatedBy: 'Peter Pan' },
];

const generateServiceRoles = (serviceId: string, specificRoles: { name: string, description: string }[] = []): ServiceRole[] => {
  const roles: ServiceRole[] = [];
  if (specificRoles.length > 0) {
    specificRoles.forEach((role, index) => {
      roles.push({
        id: `${serviceId}-r${index + 1}`,
        name: role.name,
        description: role.description,
        status: 'Active',
        updatedOn: new Date(Date.now() - (index % 5) * 24 * 60 * 60 * 1000).toISOString(),
        updatedBy: 'System',
      });
    });
  } else {
    // Default dummy roles
    ['Admin', 'User', 'Viewer'].forEach((roleName, index) => {
      roles.push({
        id: `${serviceId}-dr${index + 1}`,
        name: `${roleName}`,
        description: `Standard ${roleName.toLowerCase()} role for this service.`,
        status: 'Active',
        updatedOn: new Date(Date.now() - (index % 3) * 24 * 60 * 60 * 1000).toISOString(),
        updatedBy: 'System',
      });
    });
  }
  return roles;
};

const qubeWireDistributorRoles = [
  { name: 'Admin', description: 'Full administrative access to Qube Wire Distributor.' },
  { name: 'Approver', description: 'Can approve content and deliveries.' },
  { name: 'Fin Ops', description: 'Manages financial operations and reporting.' },
  { name: 'Partner Admin', description: 'Administrative access for partner integrations.' },
  { name: 'Uploader', description: 'Can upload content to the platform.' },
  { name: 'QW Admin', description: 'Qube Wire system administrator.' },
  { name: 'QW Ops', description: 'Qube Wire operations staff.' },
  { name: 'QW Monitoring', description: 'Monitors system health and activity.' },
  { name: 'QWP Ops', description: 'Qube Wire Partner operations.' },
  { name: 'QWP Admin', description: 'Qube Wire Partner administrator.' },
];

const qubeWireExhibitorRoles = [
  { name: 'Admin', description: 'Full administrative access for an exhibitor.' },
  { name: 'Device Manager', description: 'Manages cinema devices and configurations.' },
  { name: 'QWC Admin', description: 'Qube Wire Cinema administrator.' },
  { name: 'QWC Device Manager', description: 'Manages QWC devices.' },
  { name: 'QWC Ops', description: 'Qube Wire Cinema operations staff.' },
  { name: 'QWC Tech Support', description: 'Provides technical support for QWC.' },
  { name: 'QWC User', description: 'Standard user of Qube Wire Cinema.' },
  { name: 'User', description: 'General user access.' },
  { name: 'iCount Admin', description: 'Administrator for iCount service integration.' },
];


export let mockQubeServices: QubeService[] = [
  { 
    id: 'qs1', name: 'Qube Wire Distributor', accessUrl: 'distributors.qubewire.com', subscribedCompaniesCount: 25, lastUpdated: new Date().toISOString(),
    description: 'Manages distribution of digital cinema packages to exhibitors worldwide. Features content uploading, KDM generation, and delivery tracking.',
    uuid: 'uuid-qwd-001', clientId: 'qwd-app-client', token: 'placeholder-token-qwd',
    roles: generateServiceRoles('qs1', qubeWireDistributorRoles),
  },
  { 
    id: 'qs2', name: 'Qube Wire Exhibitor', accessUrl: 'cinemas.qubewire.com', subscribedCompaniesCount: 150, lastUpdated: new Date().toISOString(),
    description: 'Platform for exhibitors to receive and manage digital cinema packages, KDMs, and screen content.',
    uuid: 'uuid-qwe-002', clientId: 'qwe-app-client', token: 'placeholder-token-qwe',
    roles: generateServiceRoles('qs2', qubeWireExhibitorRoles),
  },
  { 
    id: 'qs3', name: 'Qube Wire Partner', accessUrl: 'partner.qubewire.com', subscribedCompaniesCount: 10, lastUpdated: new Date().toISOString(),
    description: 'Portal for Qube Wire integration partners to manage their services and interactions with the Qube Wire ecosystem.',
    uuid: 'uuid-qwp-003', clientId: 'qwp-app-client', token: 'placeholder-token-qwp',
    roles: generateServiceRoles('qs3'),
  },
  { 
    id: 'qs4', name: 'Qube Wire Admin', accessUrl: 'admin.qubewire.com', subscribedCompaniesCount: 5, lastUpdated: new Date().toISOString(),
    description: 'Internal administrative interface for managing the Qube Wire platform, users, and global settings.',
    uuid: 'uuid-qwa-004', clientId: 'qwa-app-client', token: 'placeholder-token-qwa',
    roles: generateServiceRoles('qs4', [{name: 'Super Admin', description: 'Overall system admin'}, {name: 'Support Agent', description: 'Provides support'}]),
  },
  { 
    id: 'qs5', name: 'Qube Slate', accessUrl: 'qubeslate.com', subscribedCompaniesCount: 80, lastUpdated: new Date().toISOString(),
    description: 'A tool for creating and managing digital slates for cinema presentations.',
    uuid: 'uuid-qsla-005', clientId: 'qsla-app-client', token: 'placeholder-token-qsla',
    roles: generateServiceRoles('qs5'),
  },
  { 
    id: 'qs6', name: 'CinemasDB', accessUrl: 'cinemasdb.qubewire.com/admin', subscribedCompaniesCount: 40, lastUpdated: new Date().toISOString(),
    description: 'Comprehensive database of cinemas worldwide, used for planning and logistics in film distribution.',
    uuid: 'uuid-cdb-006', clientId: 'cdb-app-client', token: 'placeholder-token-cdb',
    roles: generateServiceRoles('qs6', [{name: 'Data Curator', description: 'Manages cinema data entries'}, {name: 'Analyst', description: 'Uses data for reports'}]),
  },
  { 
    id: 'qs7', name: 'iCount', accessUrl: 'app.icount.com', subscribedCompaniesCount: 200, lastUpdated: new Date().toISOString(),
    description: 'Service for tracking and reporting box office admissions and related data.',
    uuid: 'uuid-icnt-007', clientId: 'icnt-app-client', token: 'placeholder-token-icnt',
    roles: generateServiceRoles('qs7'),
  },
  { 
    id: 'qs8', name: 'MovieBuff Access', accessUrl: 'access.moviebuff.com', subscribedCompaniesCount: 120, lastUpdated: new Date().toISOString(),
    description: 'Platform providing access to movie information, trailers, and related content for professionals.',
    uuid: 'uuid-mbfa-008', clientId: 'mbfa-app-client', token: 'placeholder-token-mbfa',
    roles: generateServiceRoles('qs8'),
  },
  { 
    id: 'qs9', name: 'Qube Cinemas', accessUrl: 'notpublic.qubecinema.com', subscribedCompaniesCount: 30, lastUpdated: new Date().toISOString(),
    description: 'Internal or specific Qube Cinemas service portal (details not public).',
    uuid: 'uuid-qcs-009', clientId: 'qcs-app-client', token: 'placeholder-token-qcs',
    roles: generateServiceRoles('qs9'),
  },
  { 
    id: 'qs10', name: 'Qube Account', accessUrl: 'account.qubecinema.com', subscribedCompaniesCount: 0, lastUpdated: new Date().toISOString(),
    description: 'Centralized identity and access management for all Qube services. Manages companies, users, and their permissions.',
    uuid: 'uuid-qacc-010', clientId: 'qacc-app-client', token: 'placeholder-token-qacc',
    roles: generateServiceRoles('qs10', [{name: 'Portal Admin', description: 'Administers Qube Account settings'}, {name: 'Company Admin', description: 'Manages a specific company account'}]),
  },
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
            legalName = `${baseLegalName} ${attempt + 2}`; // Append a number if name is taken
            attempt++;
        }
        usedLegalNames.add(legalName);

        const loc = locations[i % locations.length];
        
        // Deterministic selection of services, e.g., based on index `i`
        const numServicesToPick = (i % 3) + 1; // Pick 1, 2, or 3 services
        const serviceStartIndex = i % (mockQubeServices.length - numServicesToPick > 0 ? mockQubeServices.length - numServicesToPick : 1);
        const baseServices = mockQubeServices
            .filter(s => s.name !== 'Qube Account') // Exclude Qube Account for base selection
            .slice(serviceStartIndex, serviceStartIndex + numServicesToPick)          
            .map(s => s.name);
        
        const company: Company = {
            id: `${i + 1}`,
            legalName: legalName,
            displayName: legalName.split(" ")[0] + (legalName.includes("Pictures") || legalName.includes("Studios") || legalName.includes("Entertainment") || legalName.includes("Films") ? " " + legalName.split(" ")[1] : ""), // Shorter display name
            companyCode: `${legalName.substring(0,3).toUpperCase()}${100+i}`,
            companyUuid: `uuid-${Date.now()}-${i}`, // This should be a real UUID in production
            logoUrl: `https://placehold.co/100x100.png`, // Default placeholder
            data_ai_hint: legalName.split(" ")[0].toLowerCase() + (legalName.split(" ").length > 1 ? " " + legalName.split(" ")[1].toLowerCase() : ""),
            subscribedServices: Array.from(new Set([...baseServices, 'Qube Account'])), // Ensure Qube Account is always included
            status: (i % 10 !== 0) ? 'Active' : 'Inactive', // ~90% active
            lastUpdated: new Date(Date.now() - (i % 365) * 24 * 60 * 60 * 1000).toISOString(), // Random last updated within a year
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

export const mockCompanies: Company[] = generateRandomCompanies(50);

const qubeAccountService = mockQubeServices.find(s => s.id === 'qs10');
if (qubeAccountService) {
    qubeAccountService.subscribedCompaniesCount = mockCompanies.filter(c => c.status === 'Active').length; // All active companies use Qube Account
}

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
  
  const numServices = (i % 2) + 1; 
  const availableServices = mockQubeServices.filter(s => s.name !== 'Qube Account');
  const serviceStartIndex = i % (availableServices.length > numServices ? availableServices.length - numServices : 1);
  
  const companyServices = availableServices
      .slice(serviceStartIndex, serviceStartIndex + numServices) 
      .map(s => s.name);

  return {
    id: `cu${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${emailName}@${domains[i % domains.length]}`,
    associatedServices: Array.from(new Set([...companyServices, 'Qube Account'])), 
    status: (i % 5 !== 0) ? 'Active' : 'Inactive',
  };
});


export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalUsers: mockCompanyUsers.length + mockPortalUsers.length,
  activeServices: mockQubeServices.filter(s => s.subscribedCompaniesCount > 0).length,
};

export const mockRecentActivities: RecentActivity[] = []; // Initialize empty

if (mockCompanies.length > 0 && mockCompanies[0]) {
    mockRecentActivities.push(
        { id: 'ra1', description: `New company "${mockCompanies[0].displayName}" onboarded.`, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'CompanyUpdate', icon: Building2 }
    );
    if (mockCompanyUsers.length > 0 && mockCompanyUsers[0]) {
      mockRecentActivities.push(
          { id: 'ra2', description: `User ${mockCompanyUsers[0].name} added to ${mockCompanies[0].displayName}.`, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), user: 'Peter Pan', type: 'UserUpdate', icon: UserPlus }
      );
    }
}
mockRecentActivities.push(
  { id: 'ra3', description: 'Qube Wire Exhibitor service updated.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), type: 'ServiceSubscription', icon: ServerCog },
  { id: 'ra4', description: 'System maintenance scheduled for tomorrow.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'System', icon: ShieldCheck }
);


// Update Qube Account service count based on final data
if (qubeAccountService) {
    qubeAccountService.subscribedCompaniesCount = mockCompanies.filter(c => c.status === 'Active').length;
}
// Update other service counts based on company subscriptions
mockQubeServices.forEach(service => {
  if (service.name !== 'Qube Account') {
    service.subscribedCompaniesCount = mockCompanies.filter(
      company => company.status === 'Active' && company.subscribedServices.includes(service.name)
    ).length;
  }
});

mockQubeServices.sort((a, b) => a.name.localeCompare(b.name));

