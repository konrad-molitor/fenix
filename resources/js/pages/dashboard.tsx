import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import { GlobeIcon, RowsIcon } from '@radix-ui/react-icons';
import DashboardMap from './dashboard/map';
import DashboardList from './dashboard/list';

export default function Dashboard() {
    const { t } = useTranslation();
    const [isMapView, setIsMapView] = useState(true);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.dashboard', 'Dashboard'),
            href: dashboard().url,
        },
    ];

    const switchControl = (
        <div className="flex items-center gap-2">
            <GlobeIcon className={`h-4 w-4 transition-colors ${isMapView ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
                variant="neutral"
                checked={!isMapView}
                onCheckedChange={(checked) => setIsMapView(!checked)}
                aria-label={t('dashboard.toggle_view', 'Toggle between map and list view')}
            />
            <RowsIcon className={`h-4 w-4 transition-colors ${!isMapView ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs} controls={switchControl}>
            <Head title={t('nav.dashboard', 'Dashboard')} />
            {isMapView ? <DashboardMap /> : <DashboardList />}
        </AppLayout>
    );
}
