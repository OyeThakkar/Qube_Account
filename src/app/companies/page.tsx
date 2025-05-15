
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

export default function CompanyManagementPage() {
  const companies: Company[] = mockCompanies;
  // TODO: Implement actual search and filter logic

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
          <Input type="search" placeholder="Search companies..." className="pl-8 w-full" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by service" />
          </SelectTrigger>
          <SelectContent>
            {mockQubeServices.map(service => (
              <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
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
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Subscribed Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Image
                    src={company.logoUrl || `https://placehold.co/40x40.png`}
                    alt={`${company.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    data-ai-hint={company.data_ai_hint || "company logo"}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/companies/${company.id}`} className="hover:underline text-primary">
                    {company.name}
                  </Link>
                </TableCell>
                <TableCell>{company.location}</TableCell>
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
          </TableBody>
        </Table>
      </div>
      {/* TODO: Add pagination */}
    </>
  );
}
