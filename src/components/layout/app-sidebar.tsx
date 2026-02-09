
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Building2,
  Users,
  Package as ServiceIcon, // Renamed to avoid conflict with React.Service
  Settings,
  Power,
  Moon,
  Sun,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed for theme toggling
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/companies', label: 'Company Management', icon: Building2 },
  { href: '/portal-users', label: 'Portal Users', icon: Users },
  { href: '/services', label: 'Services', icon: ServiceIcon },
  { href: '/ad-pods', label: 'Ad Pod Compiler', icon: Film },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="4" height="4" rx="1"></rect>
            <rect x="7" y="13" width="4" height="4" rx="1"></rect>
            <rect x="13" y="7" width="4" height="4" rx="1"></rect>
            <rect x="13" y="13" width="4" height="4" rx="1"></rect>
          </svg>
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            Qube Account
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: 'right', hidden: !mounted }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {mounted && (
         <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
            {theme === 'dark' ? <Sun className="mr-2 group-data-[collapsible=icon]:mr-0" /> : <Moon className="mr-2 group-data-[collapsible=icon]:mr-0" />}
            <span className="group-data-[collapsible=icon]:hidden">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </Button>
        )}
        <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Power className="mr-2 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
