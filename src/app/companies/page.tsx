
"use client"; 

import React, { useState, useMemo } from 'react'; 
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockCompanies, mockQubeServices } from '@/lib/mock-data';
import type { Company } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Search, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"; 

const ITEMS_PER_PAGE = 10; 

export default function CompanyManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      const matchesSearch = company.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            company.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (company.address.city && company.address.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesService = serviceFilter ? company.subscribedServices.includes(serviceFilter) : true;
      const matchesStatus = statusFilter ? company.status === statusFilter : true;
      return matchesSearch && matchesService && matchesStatus;
    });
  }, [searchTerm, serviceFilter, statusFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1); 
      if (currentPage > halfMaxPages + 1 && totalPages > maxPagesToShow) {
         if (currentPage > halfMaxPages + 2) items.push("ellipsis_start");
      }

      let startPage = Math.max(2, currentPage - halfMaxPages + (currentPage + halfMaxPages >= totalPages ? totalPages - (currentPage + halfMaxPages) -1 : 0) );
      if (startPage <= 2 && currentPage > halfMaxPages +1) startPage = currentPage - halfMaxPages +1;


      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
       if (currentPage <= halfMaxPages) endPage = Math.min(totalPages -1, maxPagesToShow-1);


      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }

      if (currentPage < totalPages - halfMaxPages && totalPages > maxPagesToShow) {
         if (currentPage < totalPages - halfMaxPages -1 ) items.push("ellipsis_end");
      }
      items.push(totalPages); 
    }
    return items.filter((item, index, self) => { 
        if(typeof item === 'string' && typeof self[index-1] === 'string' && item.startsWith('ellipsis') && self[index-1]?.toString().startsWith('ellipsis')) return false;
        return self.indexOf(item) === index || typeof item === 'string';
    });
  };


  return (
    <>
      <PageHeader title="Company Management" description="Manage all company accounts.">
        <Button asChild>
          <Link href="/companies/new"><PlusCircle /> Add New Company</Link>
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search companies by name, city..." 
            className="pl-8 w-full" 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <Select value={serviceFilter} onValueChange={(value) => { setServiceFilter(value === "All Services" ? "" : value); setCurrentPage(1);}}>
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
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value === "All Statuses" ? "" : value); setCurrentPage(1);}}>
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

      <div className="rounded-lg border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Display Name</TableHead>
              {/* <TableHead>Location</TableHead> // Removed as per request */}
              <TableHead>Subscribed Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Image
                    src={company.logoUrl || `https://placehold.co/40x40.png`}
                    alt={`${company.displayName} logo`}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={company.data_ai_hint || "company logo"}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/companies/${company.id}`} className="hover:underline text-primary">
                    {company.displayName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{company.legalName}</p>
                  <p className="text-xs text-muted-foreground">{company.address.city}{company.address.state ? `, ${company.address.state}` : ''}</p>
                </TableCell>
                {/* <TableCell>{company.address.city}, {company.address.state || company.address.country}</TableCell> // Removed */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {company.subscribedServices.slice(0, 2).map(service => (
                      <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                    ))}
                    {company.subscribedServices.length > 2 && (
                      <Badge variant="secondary" className="text-xs">+{company.subscribedServices.length - 2} more</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={company.status === 'Active' ? 'default' : 'destructive'} 
                         className={company.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(company.lastUpdated), 'PP')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/companies/${company.id}`}><Edit3 className="mr-2 h-4 w-4" /> Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {paginatedCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center"> {/* Colspan updated */}
                  No companies found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1);}} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={currentPage === 1}
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
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
