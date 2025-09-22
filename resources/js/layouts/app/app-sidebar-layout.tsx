import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, type ReactNode } from 'react';

interface AppSidebarLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    controls?: ReactNode;
}

export default function AppSidebarLayout({ children, breadcrumbs = [], controls }: PropsWithChildren<AppSidebarLayoutProps>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col">
                <AppSidebarHeader breadcrumbs={breadcrumbs} controls={controls} />
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
