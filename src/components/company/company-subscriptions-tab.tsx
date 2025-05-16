
"use client";

import { useState, useMemo } from "react";
import { mockQubeServices, mockCompanyUsers, mockCompanies } from "@/lib/mock-data";
import type { QubeService, User, Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit3, UserX, ServerCog, UserPlus as UserPlusIcon } from "lucide-react"; // Renamed UserPlus to UserPlusIcon
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddUserServiceDialog from './add-user-service-dialog';
import { useToast } from "@/hooks/use-toast";

export default function CompanySubscriptionsTab({ companyId }: { companyId: string }) {
  const company = mockCompanies.find(c => c.id === companyId);
  const { toast } = useToast();

  const subscribedServices = useMemo(() => {
    if (!company) return [];
    return company.subscribedServices
      .map(serviceName => mockQubeServices.find(s => s.name === serviceName))
      .filter(service => service !== undefined) as QubeService[];
  }, [companyId, company]); // Added company to dependency array

  const [selectedService, setSelectedService] = useState<QubeService | null>(
    subscribedServices.length > 0 ? subscribedServices[0] : null
  );

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  // Mocked: users associated with the selected service for this company
  // TODO: This mock logic needs to be more robust if we want to see users added via the dialog
  const serviceUsers = selectedService
    ? mockCompanyUsers.filter(u => Math.random() > 0.3 && u.associatedServices.includes(selectedService.name)).map(u => ({ ...u, serviceRole: selectedService.roles?.[Math.floor(Math.random() * (selectedService.roles?.length || 1))]?.name || 'User' }))
    : [];

  const handleOpenAddUserDialog = () => {
    if (selectedService) {
      setIsAddUserDialogOpen(true);
    } else {
       toast({ title: "No Service Selected", description: "Please select a service from the list first.", variant: "destructive" });
    }
  };

  const handleUserAddedToService = (identifier: string, serviceId: string, roles: string[]) => {
    const existingUser = mockCompanyUsers.find(u => u.id === identifier || u.email.toLowerCase() === identifier.toLowerCase());
    const service = mockQubeServices.find(s => s.id === serviceId);
    
    const userName = existingUser ? existingUser.name : identifier; // Use email if it's a new user identifier

    console.log(`User ${userName} (ID/Email: ${identifier}) added/to be added to service ${service?.name} (ID: ${serviceId}) for company ${companyId} with roles: ${roles.join(', ')}`);
    // In a real app, you would update your backend and then refresh or optimistically update 'serviceUsers'
    // For now, we just log. The dialog itself will show a success toast.
  };


  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Subscribed Services</CardTitle>
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
                <Button size="sm" onClick={handleOpenAddUserDialog}>
                  <UserPlusIcon className="mr-2 h-4 w-4" /> Add User to Service
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
      {selectedService && (
        <AddUserServiceDialog
            isOpen={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
            service={selectedService}
            companyId={companyId}
            onUserAddedToService={handleUserAddedToService}
        />
      )}
    </div>
  );
}

