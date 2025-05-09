"use client";

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockPortalUsers } from '@/lib/mock-data';
import type { PortalUser } from '@/types';
import { PlusCircle, Search, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PortalUserForm from '@/components/user/portal-user-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function PortalUsersPage() {
  const [users, setUsers] = useState<PortalUser[]>(mockPortalUsers); // In real app, this would be fetched
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PortalUser | undefined>(undefined);
  const { toast } = useToast();

  const filteredUsers = useMemo(() => 
    users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  const handleAddNewUser = () => {
    setEditingUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: PortalUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };
  
  const handleDeactivateUser = (userId: string) => {
    // Placeholder for deactivation logic
    console.log("Deactivate user:", userId);
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId)); // Example: remove from list
    toast({
      title: "User Deactivated",
      description: `User with ID ${userId} has been deactivated.`,
      variant: "destructive"
    });
  };

  return (
    <>
      <PageHeader title="Portal User Management" description="Manage internal users of the Qube Account portal.">
        <Button onClick={handleAddNewUser}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </PageHeader>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search users by name, email, or role..." 
            className="pl-8 w-full md:w-1/2 lg:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit Portal User' : 'Add New Portal User'}</DialogTitle>
          </DialogHeader>
          <PortalUserForm user={editingUser} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Updated On</TableHead>
              <TableHead>Last Updated By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}
                    className={user.role === 'Admin' ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(user.lastUpdatedOn), 'PPp')}</TableCell>
                <TableCell>{user.lastUpdatedBy}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No portal users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add pagination if list grows, though PRD says "no more than 20 users" */}
    </>
  );
}
