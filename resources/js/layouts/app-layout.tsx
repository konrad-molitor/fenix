import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    controls?: ReactNode;
}

export default ({ children, breadcrumbs, controls, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} controls={controls} {...props}>
        {children}
    </AppLayoutTemplate>
);
