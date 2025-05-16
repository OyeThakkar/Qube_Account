
import PageHeader from '@/components/shared/page-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockQubeServices } from '@/lib/mock-data';
import type { QubeService } from '@/types';
import Link from 'next/link';
import { ExternalLink, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const services: QubeService[] = mockQubeServices;

  return (
    <>
      <PageHeader title="Qube Services" description="List of all available Qube Services and their status." />

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
                  <Link href={`https://${service.accessUrl}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
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
                  No services available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Note: Service configuration involves managing service-specific settings and roles.
      </p>
    </>
  );
}

