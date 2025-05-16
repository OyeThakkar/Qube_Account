
import PageHeader from '@/components/shared/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockQubeServices } from '@/lib/mock-data';
import type { QubeService } from '@/types';
import Link from 'next/link';
import { ExternalLink, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const ServiceTable: React.FC<{ services: QubeService[] }> = ({ services }) => {
  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Access URL</TableHead>
            <TableHead className="text-center">Subscribed Companies (Active)</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Configuration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>
                <Link href={service.accessUrl.startsWith('http') ? service.accessUrl : `https://${service.accessUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                  {service.accessUrl} <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </TableCell>
              <TableCell className="text-center">{service.subscribedCompaniesCount}</TableCell>
              <TableCell>{format(new Date(service.lastUpdated), 'PP')}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/services/${service.id}/configure`}>
                    <Settings2 className="mr-2 h-4 w-4" /> Configure
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No services available in this category.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default function ServicesPage() {
  const allServices: QubeService[] = mockQubeServices; // Already sorted alphabetically
  const internalServiceNames = ["CinemasDB", "Qube Account", "Qube Wire Admin"];
  const internalServices: QubeService[] = allServices.filter(service =>
    internalServiceNames.includes(service.name)
  ).sort((a, b) => a.name.localeCompare(b.name)); // Ensure internal services are also sorted

  return (
    <>
      <PageHeader title="Qube Services" description="List of Qube Services and their status." />

      <Tabs defaultValue="all-services" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="all-services">All Company Services</TabsTrigger>
          <TabsTrigger value="internal-services">Internal Company Services</TabsTrigger>
        </TabsList>

        <TabsContent value="all-services">
          <ServiceTable services={allServices} />
          <p className="mt-4 text-sm text-muted-foreground">
            This list includes all services available for company subscriptions. Service configuration involves managing service-specific settings and roles.
          </p>
        </TabsContent>

        <TabsContent value="internal-services">
          <ServiceTable services={internalServices} />
           <p className="mt-4 text-sm text-muted-foreground">
            These services are primarily for internal Qube operations or administration.
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}
