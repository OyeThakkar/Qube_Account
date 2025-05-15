
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCompanies } from '@/lib/mock-data';
import type { Company } from '@/types';
import CompanyForm from '@/components/company/company-form';
import CompanyUsersTab from '@/components/company/company-users-tab';
import CompanySubscriptionsTab from '@/components/company/company-subscriptions-tab';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Users, ServerCog } from 'lucide-react';
import { notFound } from 'next/navigation'; 
import { Badge } from '@/components/ui/badge'; 

interface CompanyProfilePageProps {
  params: { id: string };
}

export default function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const company = mockCompanies.find((c) => c.id === params.id);

  if (!company) {
    notFound(); 
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
          </Link>
        </Button>
      </div>

      <PageHeader title={company.displayName} description={`Manage details for ${company.legalName}.`}>
      </PageHeader>

      <div className="flex items-center space-x-4 mb-6">
        <Image
            src={company.logoUrl || `https://placehold.co/80x80.png`}
            alt={`${company.displayName} logo`}
            width={80}
            height={80}
            className="rounded-lg object-cover border"
            data-ai-hint={company.data_ai_hint || "company logo large"}
        />
        <div>
            <h2 className="text-xl font-semibold">{company.displayName}</h2>
            <p className="text-sm text-muted-foreground">{company.legalName}</p>
            <p className="text-sm text-muted-foreground">
              {company.address.city}{company.address.state ? `, ${company.address.state}` : ''}{company.address.country !== 'USA' || !company.address.state ? `, ${company.address.country}`: ''}
            </p>
            <Badge variant={company.status === 'Active' ? 'default' : 'destructive'} 
                   className={`mt-1 ${company.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}`}>
              {company.status}
            </Badge>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Company Details</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Company Users</TabsTrigger>
          <TabsTrigger value="subscriptions"><ServerCog className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Company Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <CompanyForm company={company} />
        </TabsContent>
        
        <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>Company Users</CardTitle>
                    <CardDescription>Manage users associated with {company.displayName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CompanyUsersTab companyId={company.id} />
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
             <Card>
                <CardHeader>
                    <CardTitle>Service Subscriptions</CardTitle>
                    <CardDescription>Manage Qube Service subscriptions and user roles for {company.displayName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CompanySubscriptionsTab companyId={company.id} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
