
"use client";

import type { User } from "@/types";
import { mockCompanyUsers, mockQubeServices } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, UserPlus, Edit3, UserX, Search } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";


// Placeholder for Add/Edit User Dialog
// import UserFormDialog from "@/components/user/user-form-dialog"; 

const ITEMS_PER_PAGE = 10;

export default function CompanyUsersTab({ companyId }: { companyId: string }) {
  // For this demo, we'll use the global mockCompanyUsers. 
  // In a real app, you'd fetch users for the specific companyId.
  const allUsers: User[] = mockCompanyUsers; 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>(''); // Empty string for "All Services"
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(''); // Empty string for "All Statuses"
  const [currentPage, setCurrentPage] = useState(1);

  // const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  // const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearchTerm = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService = selectedServiceFilter 
        ? user.associatedServices.includes(selectedServiceFilter)
        : true;
        
      const matchesStatus = selectedStatusFilter
        ? user.status === selectedStatusFilter
        : true;
        
      return matchesSearchTerm && matchesService && matchesStatus;
    });
  }, [allUsers, searchTerm, selectedServiceFilter, selectedStatusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Max number of page links to show
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1); // Always show first page
      if (currentPage > halfMaxPages + 1) {
        items.push("ellipsis_start");
      }

      let startPage = Math.max(2, currentPage - halfMaxPages + (currentPage + halfMaxPages > totalPages ? totalPages - (currentPage + halfMaxPages) : 0));
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
      
      // Adjust startPage if endPage is too small
      if(endPage < startPage + maxPagesToShow -3 && startPage > 2){
        startPage = Math.max(2, endPage - maxPagesToShow +3);
      }


      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (currentPage < totalPages - halfMaxPages) {
        items.push("ellipsis_end");
      }
      items.push(totalPages); // Always show last page
    }
    return items;
  };


  // const handleAddUser = () => { setEditingUser(null); setIsUserDialogOpen(true); };
  // const handleEditUser = (user: User) => { setEditingUser(user); setIsUserDialogOpen(true); };
  // const handleDeactivateUser = (user: User) => { console.log("Deactivate user", user.id); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search users by name/email..." 
             value={searchTerm}
             onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
             className="pl-8"
           />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedServiceFilter} onValueChange={(value) => {setSelectedServiceFilter(value === "All Services" ? "" : value); setCurrentPage(1);}}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Services">All Services</SelectItem>
              {mockQubeServices.map(service => (
                <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatusFilter} onValueChange={(value) => {setSelectedStatusFilter(value === "All Statuses" ? "" : value); setCurrentPage(1);}}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full sm:w-auto" >{/*onClick={handleAddUser}*/}
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service(s)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.associatedServices.length > 0 
                    ? user.associatedServices.join(', ').length > 30 
                      ? `${user.associatedServices.join(', ').substring(0,27)}...` 
                      : user.associatedServices.join(', ')
                    : 'N/A'}
                </TableCell>
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
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1);}} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {getPaginationItems().map((item, index) => (
              <PaginationItem key={index}>
                {typeof item === 'number' ? (
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(item);}}
                    isActive={currentPage === item}
                  >
                    {item}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) handlePageChange(currentPage + 1);}}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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
