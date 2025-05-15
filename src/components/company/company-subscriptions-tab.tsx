
"use client";

import { useState, useMemo } from "react";
import { mockQubeServices, mockCompanyUsers, mockCompanies } from "@/lib/mock-data";
import type { QubeService, User, Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit3, UserX, ServerCog, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CompanySubscriptionsTab({ companyId }: { companyId: string }) {
  const company = mockCompanies.find(c => c.id === companyId);

  const subscribedServices = useMemo(() => {
    if (!company) return [];
    // Map service names from company.subscribedServices to full QubeService objects
    return company.subscribedServices
      .map(serviceName => mockQubeServices.find(s => s.name === serviceName))
      .filter(service => service !== undefined) as QubeService[];
  }, [company]);

  const [selectedService, setSelectedService] = useState<QubeService | null>(
    subscribedServices.length > 0 ? subscribedServices[0] : null
  );

  // Mocked: users associated with the selected service for this company
  const serviceUsers = selectedService
    ? mockCompanyUsers.filter(u => Math.random() > 0.3).map(u => ({ ...u, serviceRole: ['Admin', 'Editor', 'Viewer'][Math.floor(Math.random() * 3)] }))
    : [];

  // const handleManageUserAccess = (userId: string, serviceId: string) => { console.log("Manage user", userId, "access for service", serviceId); };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Subscribed Services</CardTitle>
          {/* Removed "Add Service" button as subscriptions are managed in CompanyForm */}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {subscribedServices.map((service) => (
                <Button
                  key={service.id}
                  variant={selectedService?.id === service.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedService(service)}
                >
                  <ServerCog className="mr-2 h-4 w-4" />
                  {service.name}
                </Button>
              ))}
              {subscribedServices.length === 0 && (
                <p className="text-sm text-muted-foreground p-4 text-center">No services subscribed.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedService ? `Users & Roles for ${selectedService.name}` : "Select a Service"}
          </CardTitle>
          {selectedService && (
            <p className="text-sm text-muted-foreground">Manage user access and roles for this service.</p>
          )}
        </CardHeader>
        <CardContent>
          {selectedService ? (
            <>
              <div className="mb-4 text-right">
                <Button size="sm" >{/*onClick={() => console.log("Add user to service", selectedService.id)}*/}
                  <UserPlus className="mr-2 h-4 w-4" /> Add User to Service
                </Button>
              </div>
              <div className="rounded-lg border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role in Service</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceUsers.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.serviceRole}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem >{/*onClick={() => handleManageUserAccess(user.id, selectedService.id)}*/}
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Access/Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                                <UserX className="mr-2 h-4 w-4" /> Deactivate Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {serviceUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No users assigned to this service for this company.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <ServerCog className="h-12 w-12 mb-4" />
              <p>Select a service from the left panel to view associated users and roles.</p>
              {company && subscribedServices.length === 0 && (
                 <p className="mt-2">This company currently has no Qube services subscribed.</p>
              )}
               {!company && (
                 <p className="mt-2">Could not load company data.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
