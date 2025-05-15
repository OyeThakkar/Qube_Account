
import CompanyForm from '@/components/company/company-form';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { mockCompanies } from '@/lib/mock-data';
import type { Company } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditCompanyPageProps {
  params: { id: string };
}

export default function EditCompanyPage({ params }: EditCompanyPageProps) {
  const company = mockCompanies.find((c) => c.id === params.id);

  if (!company) {
    notFound();
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href={`/companies/${company.id}`}> {/* Link back to the company's profile page */}
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Company Profile
          </Link>
        </Button>
      </div>
      <PageHeader 
        title={`Edit ${company.displayName}`} 
        description="Update the details for this company account." 
      />
      <CompanyForm company={company} />
    </>
  );
}
