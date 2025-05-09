"use client";

import PageHeader from '@/components/shared/page-header';
import CompanyForm from '@/components/company/company-form';
// import { Card, CardContent } from '@/components/ui/card'; // Card and CardContent are not used here.
import { useRouter } from 'next/navigation'; // Import for client-side navigation

export default function NewCompanyPage() {
  const router = useRouter();

  // In a real app, redirect or show success message
  const handleSuccess = () => {
    console.log("Company created successfully, redirecting...");
    // For actual redirection, use router.push.
    // This example assumes CompanyForm shows a toast, and redirection happens from here.
    router.push('/companies'); 
  };

  return (
    <>
      <PageHeader title="Add New Company" description="Fill in the details to create a new company account." />
      {/* 
        The CompanyForm is wrapped in a Card inside its own component, 
        so no need to wrap it in a Card here again.
      */}
      <CompanyForm onSubmitSuccess={handleSuccess} />
    </>
  );
}
