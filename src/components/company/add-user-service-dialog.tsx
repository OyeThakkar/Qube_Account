
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
import { AlertCircle, UserPlus } from "lucide-react"; // Added UserPlus
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

interface AddUserServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: QubeService | null;
  companyId: string; 
  onUserAddedToService: (identifier: string, serviceId: string, roles: string[]) => void; // identifier can be userId or email
}

export default function AddUserServiceDialog({ isOpen, onOpenChange, service, companyId, onUserAddedToService }: AddUserServiceDialogProps) {
  const [email, setEmail] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setFoundUser(null);
      setSelectedRoleIds([]);
      setSearchAttempted(false);
    }
  }, [isOpen]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setFoundUser(null); 
    // setSelectedRoleIds([]); // Optionally reset roles, or keep them if user is just correcting email
    setSearchAttempted(false);

    if (newEmail.length > 5 && newEmail.includes('@') && newEmail.includes('.')) { // Basic validation
      const user = mockCompanyUsers.find(u => u.email.toLowerCase() === newEmail.toLowerCase());
      if (user) {
        setFoundUser(user);
      } else {
        setFoundUser(null);
      }
      setSearchAttempted(true);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const isValidEmail = (emailStr: string) => {
    return emailStr.length > 5 && emailStr.includes('@') && emailStr.includes('.');
  }

  const handleSubmit = () => {
    if (!service || selectedRoleIds.length === 0 || !isValidEmail(email)) {
      toast({
        title: "Missing Information",
        description: "Please ensure a valid email is entered and at least one role is selected.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedRoleNames = service.roles?.filter(r => selectedRoleIds.includes(r.id)).map(r => r.name) || [];
    
    if (foundUser) {
      onUserAddedToService(foundUser.id, service.id, selectedRoleNames);
      toast({
        title: "User Access Granted",
        description: `${foundUser.name} has been given access to ${service.name} with roles: ${selectedRoleNames.join(', ')}.`,
      });
    } else { // New user flow
      // In a real app, this would trigger user creation API for the company
      onUserAddedToService(email, service.id, selectedRoleNames); // Pass email as identifier
      toast({
        title: "New User Registration Initiated",
        description: `User with email ${email} will be created for this company and granted access to ${service.name} with roles: ${selectedRoleNames.join(', ')}. (Mock behavior)`,
      });
    }
    onOpenChange(false); 
  };

  if (!service) return null;

  const memberSinceDate = foundUser ? format(new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000), 'PP') : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add User to {service.name}</DialogTitle>
          <DialogDescription>
            Enter user's email. If found, assign roles. If not, a new user will be created for this company.
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

          {searchAttempted && !foundUser && isValidEmail(email) && (
             <Alert variant="default" className="col-span-4"> 
                <UserPlus className="h-4 w-4" />
                <AlertTitle>New User Registration</AlertTitle>
                <AlertDescription>
                  This email is not associated with an existing user. 
                  If you proceed, a new user profile will be created with this email for company {companyId} and assigned the selected roles for {service.name}.
                </AlertDescription>
            </Alert>
          )}
          
          {searchAttempted && !foundUser && !isValidEmail(email) && email.length > 0 && (
             <Alert variant="destructive" className="col-span-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid Email</AlertTitle>
                <AlertDescription>Please enter a valid email address.</AlertDescription>
            </Alert>
          )}


          {foundUser && (
            <div className="space-y-2 mt-2 border-t pt-4">
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-1">
                <Label className="text-right col-span-1 font-semibold">Name:</Label>
                <p className="col-span-3">{foundUser.name}</p>
                <Label className="text-right col-span-1 font-semibold">Status:</Label>
                <p className="col-span-3">{foundUser.status}</p>
                <Label className="text-right col-span-1 font-semibold">Member Since:</Label>
                <p className="col-span-3 text-sm">{memberSinceDate} (Placeholder)</p>
              </div>
            </div>
          )}

          {/* Roles selection - always visible if service exists and email is potentially valid */}
          {(isValidEmail(email) || foundUser) && (
            <div className="mt-4 border-t pt-4">
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
          )}
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValidEmail(email) || selectedRoleIds.length === 0}
          >
            {foundUser ? 'Add User to Service' : 'Create User & Add to Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

