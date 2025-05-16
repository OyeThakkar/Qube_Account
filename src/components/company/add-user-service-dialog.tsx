
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCompanyUsers } from '@/lib/mock-data';
import type { QubeService, User, ServiceRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

interface AddUserServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: QubeService | null;
  companyId: string; 
  onUserAddedToService: (userId: string, serviceId: string, roles: string[]) => void;
}

export default function AddUserServiceDialog({ isOpen, onOpenChange, service, companyId, onUserAddedToService }: AddUserServiceDialogProps) {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setFoundUser(null);
      setSelectedRoleIds([]);
      setUserNotFound(false);
    }
  }, [isOpen]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setFoundUser(null); // Reset found user on email change
    setSelectedRoleIds([]); // Reset roles
    setUserNotFound(false);

    if (newEmail.includes('@') && newEmail.includes('.')) { // Basic validation
      const user = mockCompanyUsers.find(u => u.email.toLowerCase() === newEmail.toLowerCase());
      if (user) {
        setFoundUser(user);
      } else {
        // Only set userNotFound if email is reasonably long enough to be a "search attempt"
        if (newEmail.length > 5) { 
            setUserNotFound(true);
        }
      }
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    if (!foundUser || !service || selectedRoleIds.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please ensure a user is found and at least one role is selected.",
        variant: "destructive",
      });
      return;
    }
    // Map selected role IDs to role names if needed, or pass IDs directly
    const selectedRoleNames = service.roles?.filter(r => selectedRoleIds.includes(r.id)).map(r => r.name) || [];
    
    onUserAddedToService(foundUser.id, service.id, selectedRoleNames); // Or pass selectedRoleIds
    toast({
      title: "User Access Granted",
      description: `${foundUser.name} has been given access to ${service.name} with roles: ${selectedRoleNames.join(', ')}.`,
    });
    onOpenChange(false); 
  };

  if (!service) return null;

  // Placeholder for "Member Since" - in a real app, this would come from company-specific user data
  const memberSinceDate = foundUser ? format(new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000), 'PP') : 'N/A';


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add User to {service.name}</DialogTitle>
          <DialogDescription>
            Enter the user's email. If found, assign roles for this service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 flex-grow overflow-hidden">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-add-user" className="text-right">
              Email ID
            </Label>
            <Input
              id="email-add-user"
              value={email}
              onChange={handleEmailChange}
              className="col-span-3"
              placeholder="user@example.com"
              type="email"
            />
          </div>

          {userNotFound && !foundUser && (
             <Alert variant="destructive" className="col-span-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>User Not Found</AlertTitle>
                <AlertDescription>No user exists in the system with this email address.</AlertDescription>
            </Alert>
          )}

          {foundUser && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1 font-semibold">Name:</Label>
                <p className="col-span-3">{foundUser.name}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1 font-semibold">Member Since:</Label>
                <p className="col-span-3 text-sm">{memberSinceDate} (Placeholder)</p>
              </div>

              <div className="mt-2">
                <Label className="font-semibold block mb-2">Assign Roles for {service.name}:</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-3">
                  <div className="space-y-2">
                    {service.roles && service.roles.length > 0 ? service.roles.map((role: ServiceRole) => (
                      <div key={role.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoleIds.includes(role.id)}
                          onCheckedChange={() => handleRoleToggle(role.id)}
                        />
                        <Label htmlFor={`role-${role.id}`} className="font-normal cursor-pointer flex-1">
                          <span className="font-medium">{role.name}</span>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </Label>
                      </div>
                    )) : (
                        <p className="text-sm text-muted-foreground p-2">No specific roles defined for this service.</p>
                    )}
                  </div>
                </ScrollArea>
                 {selectedRoleIds.length === 0 && <p className="text-xs text-destructive mt-1">At least one role must be selected.</p>}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!foundUser || selectedRoleIds.length === 0}>Add User to Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

