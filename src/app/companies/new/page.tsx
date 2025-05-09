// "use client"; // No longer needed here as interactivity is in CompanyForm

import PageHeader from '@/components/shared/page-header';
import CompanyForm from '@/components/company/company-form';
// import { useRouter } from 'next/navigation'; // No longer needed here

export default function NewCompanyPage() {
  // const router = useRouter(); // Moved to CompanyForm

  // const handleSuccess = () => { // Moved to CompanyForm
  //   console.log("Company created successfully, redirecting...");
  //   router.push('/companies'); 
  // };

  return (
    <>
      <PageHeader title="Add New Company" description="Fill in the details to create a new company account." />
      <CompanyForm /> {/* Removed onSubmitSuccess prop */}
    </>
  );
}
