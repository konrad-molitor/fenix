import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router, usePage } from '@inertiajs/react';
import { Pencil2Icon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { SharedData } from '@/types';
import { Table as RadixTable } from '@radix-ui/themes';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    email_verified_at: string | null;
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    availableRoles: string[];
}

type DialogType = 'profile' | 'password' | 'delete' | null;

export default function AdminUsers({ users, availableRoles }: UsersPageProps) {
    const { translations } = usePage<SharedData>().props;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    const openDialog = (type: DialogType, user: User) => {
        setSelectedUser(user);
        setDialogType(type);
        if (type === 'profile') {
            setFormData({ name: user.name, email: user.email, role: user.role });
        } else {
            setFormData({});
        }
    };

    const closeDialog = () => {
        setDialogType(null);
        setSelectedUser(null);
        setFormData({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        if (dialogType === 'profile') {
            // Send both profile and role updates
            router.patch(`/admin/users/${selectedUser.id}/profile`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    // If role changed, also update it
                    if (formData.role !== selectedUser.role) {
                        router.patch(`/admin/users/${selectedUser.id}/role`, { role: formData.role }, {
                            preserveScroll: true,
                            onSuccess: () => closeDialog(),
                        });
                    } else {
                        closeDialog();
                    }
                },
            });
        } else if (dialogType === 'password') {
            router.patch(`/admin/users/${selectedUser.id}/password`, formData, {
                preserveScroll: true,
                onSuccess: () => closeDialog(),
            });
        }
    };

    // Filter users based on search and role filter
    const filteredUsers = users.data.filter((user) => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = () => {
        if (!selectedUser) return;
        router.delete(`/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => closeDialog(),
        });
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Search and Filter Bar */}
                <div className="flex gap-4">
                    <Input
                        type="text"
                        placeholder={translations['admin.users.search_placeholder']}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={translations['admin.users.filter_by_role']} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{translations['admin.users.all_roles']}</SelectItem>
                            {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <RadixTable.Root variant="surface" size="2">
                    <RadixTable.Header>
                        <RadixTable.Row>
                            <RadixTable.ColumnHeaderCell>{translations['admin.users.name']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.users.email']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.users.role']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.users.created']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.users.actions']}</RadixTable.ColumnHeaderCell>
                        </RadixTable.Row>
                    </RadixTable.Header>
                    <RadixTable.Body>
                        {filteredUsers.map((user) => (
                            <RadixTable.Row key={user.id}>
                                <RadixTable.Cell>{user.name}</RadixTable.Cell>
                                <RadixTable.Cell>{user.email}</RadixTable.Cell>
                                <RadixTable.Cell>
                                    <Badge 
                                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                                        className="min-w-[4rem] justify-center"
                                    >
                                        {user.role}
                                    </Badge>
                                </RadixTable.Cell>
                                <RadixTable.Cell>{user.created_at}</RadixTable.Cell>
                                <RadixTable.Cell>
                                    <div className="flex gap-1 items-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => openDialog('profile', user)}
                                            title={translations['admin.users.edit_profile']}
                                        >
                                            <Pencil2Icon className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => openDialog('password', user)}
                                            title={translations['admin.users.set_password']}
                                        >
                                            <ResetIcon className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => openDialog('delete', user)}
                                            title={translations['admin.users.delete_user']}
                                        >
                                            <TrashIcon className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </RadixTable.Cell>
                            </RadixTable.Row>
                        ))}
                    </RadixTable.Body>
                </RadixTable.Root>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Page {users.current_page} of {users.last_page}
                        </div>
                        <div className="flex gap-2">
                            {users.current_page > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.get(`/admin?page=${users.current_page - 1}`, {}, { preserveScroll: true })
                                    }
                                >
                                    Previous
                                </Button>
                            )}
                            {users.current_page < users.last_page && (
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.get(`/admin?page=${users.current_page + 1}`, {}, { preserveScroll: true })
                                    }
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Edit Profile Dialog (includes role change) */}
            <Dialog open={dialogType === 'profile'} onOpenChange={closeDialog}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{translations['admin.users.edit_profile']}</DialogTitle>
                            <DialogDescription>
                                {selectedUser?.name} (ID: {selectedUser?.id})
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{translations['admin.users.name']}</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{translations['admin.users.email']}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">{translations['admin.users.role']}</Label>
                                <Select value={formData.role || ''} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableRoles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                {translations['actions.cancel']}
                            </Button>
                            <Button type="submit">{translations['actions.save']}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Set Password Dialog */}
            <Dialog open={dialogType === 'password'} onOpenChange={closeDialog}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{translations['admin.users.set_password']}</DialogTitle>
                            <DialogDescription>
                                {selectedUser?.name} ({selectedUser?.email})
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">{translations['admin.users.new_password']}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={translations['admin.users.new_password_placeholder']}
                                    value={formData.password || ''}
                                    onChange={(e) => setFormData({ password: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                {translations['actions.cancel']}
                            </Button>
                            <Button type="submit">{translations['actions.save']}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete User Alert Dialog */}
            <AlertDialog open={dialogType === 'delete'} onOpenChange={closeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{translations['admin.users.delete_user']}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {translations['admin.users.confirm_delete']}
                            <br />
                            <strong>
                                {selectedUser?.name} ({selectedUser?.email})
                            </strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{translations['actions.cancel']}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {translations['actions.delete']}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

