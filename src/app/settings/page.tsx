
import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Bell, BookText, DatabaseZap, Wrench } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage system configurations and preferences." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" />Authentication Settings</CardTitle>
            <CardDescription>Configure login methods, MFA, and password policies.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage how users authenticate with Qube Central and connected services.
            </p>
            <Button variant="outline" disabled>Manage Authentication</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" />Notification Preferences</CardTitle>
            <CardDescription>Set up system-wide notification channels and templates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Control how and when notifications are sent for important system events.
            </p>
            <Button variant="outline" disabled>Configure Notifications</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BookText className="mr-2 h-5 w-5 text-primary" />Audit Log</CardTitle>
            <CardDescription>View a comprehensive log of all system activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track changes, access attempts, and administrative actions for security and compliance.
            </p>
            <Button variant="outline" disabled>View Audit Log</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><DatabaseZap className="mr-2 h-5 w-5 text-primary" />System Configuration</CardTitle>
            <CardDescription>General system parameters and global settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust core system settings, integrations, and default behaviors.
            </p>
            <Button variant="outline" disabled>Modify Configuration</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary" />System Maintenance</CardTitle>
            <CardDescription>Options for system upkeep and background tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Perform maintenance tasks, manage backups, and monitor system health.
            </p>
            <Button variant="outline" disabled>Maintenance Options</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
