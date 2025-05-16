
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockQubeServices } from '@/lib/mock-data';
import type { QubeService, ServiceRole } from '@/types';
import Link from 'next/link';
import { ArrowLeft, FileText, UsersCog } from 'lucide-react';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

interface ConfigureServicePageProps {
  params: { id: string };
}

const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-b-0">
    <dt className="font-medium text-muted-foreground">{label}</dt>
    <dd className="col-span-2">{value || <span className="italic text-muted-foreground">Not set</span>}</dd>
  </div>
);

export default function ConfigureServicePage({ params }: ConfigureServicePageProps) {
  const service = mockQubeServices.find((s) => s.id === params.id);

  if (!service) {
    notFound();
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>

      <PageHeader 
        title={`Configure: ${service.name}`}
        description={service.description || "Manage settings and roles for this service."}
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-6">
          <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Service Details</TabsTrigger>
          <TabsTrigger value="roles"><UsersCog className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Service Roles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Core information and identifiers for {service.name}.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1">
                <DetailItem label="Service Name" value={service.name} />
                <DetailItem label="Service URL" value={service.accessUrl} />
                <DetailItem label="Service Description" value={service.description} />
                <DetailItem label="Service UUID" value={service.uuid} />
                <DetailItem label="Service Client ID" value={service.clientId} />
                <DetailItem label="Service Token" value={service.token ? `${service.token.substring(0,10)}... (placeholder)` : undefined} />
                <DetailItem label="Last Updated" value={format(new Date(service.lastUpdated), 'PPpp')} />
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Note: Sensitive fields like Service Token are placeholders and would be managed securely in a real system.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
            <Card>
                <CardHeader>
                    <CardTitle>Service Roles</CardTitle>
                    <CardDescription>Roles available within {service.name}. These roles are defined by the service itself.</CardDescription>
                </CardHeader>
                <CardContent>
                  {service.roles && service.roles.length > 0 ? (
                    <div className="rounded-lg border overflow-hidden shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Updated On</TableHead>
                            <TableHead>Updated By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {service.roles.map((role: ServiceRole) => (
                            <TableRow key={role.id}>
                              <TableCell className="font-medium">{role.name}</TableCell>
                              <TableCell>{role.description}</TableCell>
                              <TableCell>
                                <Badge variant={role.status === 'Active' ? 'default' : 'destructive'}
                                  className={role.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                                  {role.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{format(new Date(role.updatedOn), 'PPp')}</TableCell>
                              <TableCell>{role.updatedBy}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No specific roles defined or retrievable for this service.</p>
                  )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
