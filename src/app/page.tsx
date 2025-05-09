
import PageHeader from '@/components/shared/page-header';
import SummaryCard from '@/components/dashboard/summary-card';
import RecentActivityList from '@/components/dashboard/recent-activity-list';
import ExampleChart from '@/components/dashboard/example-chart';
import { Button } from '@/components/ui/button';
import { mockDashboardMetrics, mockRecentActivities } from '@/lib/mock-data';
import { Building2, Users, Package as ServiceIcon, PlusCircle, UserPlus, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { totalCompanies, totalUsers, activeServices } = mockDashboardMetrics;
  const recentActivities = mockRecentActivities;

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your Qube Account system.">
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/companies/new"><PlusCircle /> Add Company</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/portal-users"><UserPlus /> Manage Portal Users</Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        <SummaryCard title="Total Companies" value={totalCompanies} icon={Building2} description="All registered companies" />
        <SummaryCard title="Total Users" value={totalUsers} icon={Users} description="Across all companies and portal" />
        <SummaryCard title="Active Services" value={activeServices} icon={ServiceIcon} description="Currently in use" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ExampleChart />
        </div>
        <div className="lg:col-span-3">
          <RecentActivityList activities={recentActivities} />
        </div>
      </div>
      
      <div className="mt-8 p-6 border rounded-lg shadow-sm bg-card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="outline" asChild className="justify-start">
            <Link href="/companies"><Building2 className="mr-2"/>View Companies</Link>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <Link href="/services"><ServiceIcon className="mr-2"/>Manage Services</Link>
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <Link href="/settings"><Settings className="mr-2"/>System Settings</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
