import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import * as Tabs from '@radix-ui/react-tabs';
import { Theme } from '@radix-ui/themes';
import AdminUsers from './users';
import AdminEvents from './events';
import AdminSystem from './system';

interface AdminIndexProps {
    users?: {
        data: Array<{
            id: number;
            name: string;
            email: string;
            role: string;
            created_at: string;
            email_verified_at: string | null;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    availableRoles?: string[];
}

export default function AdminIndex({ users, availableRoles }: AdminIndexProps) {
    const { translations } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Theme>
                <div className="flex flex-col gap-6 p-6">
                    <Heading
                        title={translations['admin.title']}
                        description={translations['admin.description']}
                    />

                    <Tabs.Root defaultValue="users" className="w-full">
                    <Tabs.List className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                        <Tabs.Trigger
                            value="users"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            {translations['admin.users.title']}
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="events"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            {translations['admin.events.title']}
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="system"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        >
                            {translations['admin.system.title']}
                        </Tabs.Trigger>
                    </Tabs.List>

                    <div className="mt-6">
                        <Tabs.Content value="users" className="focus-visible:outline-none">
                            {users && availableRoles && (
                                <AdminUsers users={users} availableRoles={availableRoles} />
                            )}
                        </Tabs.Content>
                        <Tabs.Content value="events" className="focus-visible:outline-none">
                            <AdminEvents />
                        </Tabs.Content>
                        <Tabs.Content value="system" className="focus-visible:outline-none">
                            <AdminSystem />
                        </Tabs.Content>
                    </div>
                </Tabs.Root>
                </div>
            </Theme>
        </AppLayout>
    );
}

