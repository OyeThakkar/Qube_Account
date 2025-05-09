"use client";

import type { User } from "@/types";
import { mockCompanyUsers } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, UserPlus, Edit3, UserX, Search } from "lucide-react";
import { useState } from "react";
// Placeholder for Add/Edit User Dialog
// import UserFormDialog from "@/components/user/user-form-dialog"; 

export default function CompanyUsersTab({ companyId }: { companyId: string }) {
  // Filter users by companyId in a real app
  const users: User[] = mockCompanyUsers.filter(u => u.email.includes('innovatech') || Math.random() > 0.5).slice(0,5); // Mocked
  const [searchTerm, setSearchTerm] = useState('');
  // const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  // const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleAddUser = () => { setEditingUser(null); setIsUserDialogOpen(true); };
  // const handleEditUser = (user: User) => { setEditingUser(user); setIsUserDialogOpen(true); };
  // const handleDeactivateUser = (user: User) => { console.log("Deactivate user", user.id); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search users..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="pl-8"
           />
        </div>
        <Button >{/*onClick={handleAddUser}*/}
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Qube Account Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.qubeAccountRole}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}
                    className={user.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem >{/*onClick={() => handleEditUser(user)}*/}
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" >{/*onClick={() => handleDeactivateUser(user)}*/}
                        <UserX className="mr-2 h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* 
      <UserFormDialog 
        isOpen={isUserDialogOpen} 
        setIsOpen={setIsUserDialogOpen} 
        user={editingUser} 
        companyId={companyId} 
      /> 
      */}
    </div>
  );
}
