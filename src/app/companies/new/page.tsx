
import PageHeader from '@/components/shared/page-header';
import CompanyForm from '@/components/company/company-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NewCompanyPage() {
  // In a real app, redirect or show success message
  const handleSuccess = () => {
    console.log("Company created successfully, redirecting...");
    // router.push('/companies');
  };

  return (
    <>
      <PageHeader title="Add New Company" description="Fill in the details to create a new company account." />
      <CompanyForm onSubmitSuccess={handleSuccess} />
    </>
  );
}
