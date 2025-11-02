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
import { usePage } from '@inertiajs/react';
import { Pencil2Icon, PlusIcon, TrashIcon, MagicWandIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useCallback } from 'react';
import { SharedData } from '@/types';
import { Table as RadixTable } from '@radix-ui/themes';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';

interface EventType {
    id: number;
    system_event_title: string;
    priority: 'high' | 'medium' | 'low';
    title_display_translation: {
        en?: string;
        es?: string;
        ru?: string;
    };
    notification_mode: 'immediate' | 'on-moderation' | 'none';
    moderator?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface EventTypesData {
    data: EventType[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

type DialogType = 'create-edit' | 'delete' | null;

export default function AdminEventTypes() {
    const { translations } = usePage<SharedData>().props;
    const [eventTypes, setEventTypes] = useState<EventTypesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [formData, setFormData] = useState<{
        system_event_title: string;
        priority: string;
        notification_mode: string;
        title_display_translation_en: string;
        title_display_translation_es: string;
        title_display_translation_ru: string;
    }>({
        system_event_title: '',
        priority: 'medium',
        notification_mode: 'immediate',
        title_display_translation_en: '',
        title_display_translation_es: '',
        title_display_translation_ru: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [notificationFilter, setNotificationFilter] = useState<string>('all');
    const [isGenerating, setIsGenerating] = useState(false);

    const priorities = ['high', 'medium', 'low'];
    const notificationModes = ['immediate', 'on-moderation', 'none'];

    const fetchEventTypes = useCallback(async (page?: number) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (searchQuery.length >= 3) {
                params.append('search', searchQuery);
            }
            if (priorityFilter !== 'all') {
                params.append('priority', priorityFilter);
            }
            if (notificationFilter !== 'all') {
                params.append('notification_mode', notificationFilter);
            }
            if (page) {
                params.append('page', page.toString());
            }

            const response = await axios.get<EventTypesData>(`/api/event-types?${params.toString()}`);
            setEventTypes(response.data);
        } catch (error) {
            console.error('Error fetching event types:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, priorityFilter, notificationFilter]);

    useEffect(() => {
        // Reset to page 1 when filters change
        fetchEventTypes(1);
    }, [fetchEventTypes]);

    const openDialog = (type: DialogType, eventType?: EventType) => {
        setDialogType(type);
        if (type === 'create-edit' && eventType) {
            setSelectedEventType(eventType);
            setFormData({
                system_event_title: eventType.system_event_title,
                priority: eventType.priority,
                notification_mode: eventType.notification_mode,
                title_display_translation_en: eventType.title_display_translation.en || '',
                title_display_translation_es: eventType.title_display_translation.es || '',
                title_display_translation_ru: eventType.title_display_translation.ru || '',
            });
        } else if (type === 'create-edit') {
            setSelectedEventType(null);
            setFormData({
                system_event_title: '',
                priority: 'medium',
                notification_mode: 'immediate',
                title_display_translation_en: '',
                title_display_translation_es: '',
                title_display_translation_ru: '',
            });
        } else if (type === 'delete' && eventType) {
            setSelectedEventType(eventType);
        }
    };

    const closeDialog = () => {
        setDialogType(null);
        setSelectedEventType(null);
        setFormData({
            system_event_title: '',
            priority: 'medium',
            notification_mode: 'immediate',
            title_display_translation_en: '',
            title_display_translation_es: '',
            title_display_translation_ru: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const payload = {
                system_event_title: formData.system_event_title,
                priority: formData.priority,
                notification_mode: formData.notification_mode,
                title_display_translation: {
                    en: formData.title_display_translation_en,
                    es: formData.title_display_translation_es,
                    ru: formData.title_display_translation_ru,
                },
            };

            if (selectedEventType) {
                // Update
                await axios.put(`/api/event-types/${selectedEventType.id}`, payload);
            } else {
                // Create
                await axios.post('/api/event-types', payload);
            }
            
            closeDialog();
            fetchEventTypes();
        } catch (error) {
            console.error('Error saving event type:', error);
        }
    };

    const handleDelete = async () => {
        if (!selectedEventType) return;
        
        try {
            await axios.delete(`/api/event-types/${selectedEventType.id}`);
            closeDialog();
            fetchEventTypes();
        } catch (error) {
            console.error('Error deleting event type:', error);
        }
    };

    const handleGenerateWithAI = async () => {
        const description = formData.system_event_title.trim();
        
        if (description.length < 3) {
            return;
        }

        setIsGenerating(true);
        
        try {
            const response = await axios.post('/api/event-types/generate', {
                description,
            });

            if (response.data.success) {
                const { system_event_title, title_display_translation } = response.data.data;
                
                setFormData({
                    ...formData,
                    system_event_title,
                    title_display_translation_en: title_display_translation.en || '',
                    title_display_translation_es: title_display_translation.es || '',
                    title_display_translation_ru: title_display_translation.ru || '',
                });
            }
        } catch (error) {
            console.error('Error generating with AI:', error);
            alert(translations['admin.event_types.ai_error'] || 'AI generation failed');
        } finally {
            setIsGenerating(false);
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'default';
            case 'low':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getNotificationBadgeVariant = (mode: string) => {
        switch (mode) {
            case 'immediate':
                return 'default';
            case 'on-moderation':
                return 'secondary';
            case 'none':
                return 'outline';
            default:
                return 'outline';
        }
    };

    if (loading && !eventTypes) {
        return <div className="flex flex-col gap-6">Loading...</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Search, Filters, and Create Button */}
                <div className="flex gap-4 items-center">
                    <Input
                        type="text"
                        placeholder={translations['admin.event_types.search_placeholder']}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={translations['admin.event_types.filter_by_priority']} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">{translations['admin.event_types.all_priorities']}</SelectItem>
                            {priorities.map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                    {translations[`admin.event_types.${priority}`]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={notificationFilter} onValueChange={setNotificationFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={translations['admin.event_types.filter_by_notification']} />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="all">{translations['admin.event_types.all_notifications']}</SelectItem>
                            {notificationModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                    {translations[`admin.event_types.${mode.replace('-', '_')}`]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={() => openDialog('create-edit')}
                        className="ml-auto"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        {translations['admin.event_types.create']}
                    </Button>
                </div>

                <RadixTable.Root variant="surface" size="2">
                    <RadixTable.Header>
                        <RadixTable.Row>
                            <RadixTable.ColumnHeaderCell>ID</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.system_title']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.priority']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.notification_mode']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.moderator']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.created']}</RadixTable.ColumnHeaderCell>
                            <RadixTable.ColumnHeaderCell>{translations['admin.event_types.actions']}</RadixTable.ColumnHeaderCell>
                        </RadixTable.Row>
                    </RadixTable.Header>
                    <RadixTable.Body>
                        {eventTypes?.data.map((eventType) => (
                            <RadixTable.Row key={eventType.id}>
                                <RadixTable.Cell>{eventType.id}</RadixTable.Cell>
                                <RadixTable.Cell>
                                    <div className="font-medium">{eventType.system_event_title}</div>
                                    {eventType.title_display_translation.en && (
                                        <div className="text-xs text-muted-foreground">
                                            {eventType.title_display_translation.en}
                                        </div>
                                    )}
                                </RadixTable.Cell>
                                <RadixTable.Cell>
                                    <Badge variant={getPriorityBadgeVariant(eventType.priority)}>
                                        {translations[`admin.event_types.${eventType.priority}`]}
                                    </Badge>
                                </RadixTable.Cell>
                                <RadixTable.Cell>
                                    <Badge variant={getNotificationBadgeVariant(eventType.notification_mode)}>
                                        {translations[`admin.event_types.${eventType.notification_mode.replace('-', '_')}`]}
                                    </Badge>
                                </RadixTable.Cell>
                                <RadixTable.Cell>
                                    {eventType.moderator ? eventType.moderator.name : '-'}
                                </RadixTable.Cell>
                                <RadixTable.Cell>
                                    {new Date(eventType.created_at).toLocaleDateString()}
                                </RadixTable.Cell>
                                <RadixTable.Cell>
                                    <div className="flex gap-1 items-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => openDialog('create-edit', eventType)}
                                            title={translations['admin.event_types.edit']}
                                        >
                                            <Pencil2Icon className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => openDialog('delete', eventType)}
                                            title={translations['admin.event_types.delete']}
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
                {eventTypes && eventTypes.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Page {eventTypes.current_page} of {eventTypes.last_page}
                        </div>
                        <div className="flex gap-2">
                            {eventTypes.current_page > 1 && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        fetchEventTypes(eventTypes.current_page - 1);
                                    }}
                                >
                                    Previous
                                </Button>
                            )}
                            {eventTypes.current_page < eventTypes.last_page && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        fetchEventTypes(eventTypes.current_page + 1);
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogType === 'create-edit'} onOpenChange={closeDialog} modal={false}>
                <DialogContent className="max-w-2xl overflow-visible">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedEventType
                                    ? translations['admin.event_types.edit']
                                    : translations['admin.event_types.create']}
                            </DialogTitle>
                            {selectedEventType && (
                                <DialogDescription>
                                    ID: {selectedEventType.id}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="system_event_title">{translations['admin.event_types.system_title']}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="system_event_title"
                                        value={formData.system_event_title}
                                        onChange={(e) => setFormData({ ...formData, system_event_title: e.target.value })}
                                        required
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateWithAI}
                                        disabled={isGenerating || formData.system_event_title.trim().length < 3}
                                        title={translations['admin.event_types.generate_with_ai']}
                                        className="min-w-[40px] px-3"
                                    >
                                        {isGenerating ? (
                                            <Spinner size="1" />
                                        ) : (
                                            <MagicWandIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">{translations['admin.event_types.priority']}</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {priorities.map((priority) => (
                                                <SelectItem key={priority} value={priority}>
                                                    {translations[`admin.event_types.${priority}`]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notification_mode">{translations['admin.event_types.notification_mode']}</Label>
                                    <Select
                                        value={formData.notification_mode}
                                        onValueChange={(value) => setFormData({ ...formData, notification_mode: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {notificationModes.map((mode) => (
                                                <SelectItem key={mode} value={mode}>
                                                    {translations[`admin.event_types.${mode.replace('-', '_')}`]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title_en">{translations['admin.event_types.title_en']}</Label>
                                <Input
                                    id="title_en"
                                    value={formData.title_display_translation_en}
                                    onChange={(e) => setFormData({ ...formData, title_display_translation_en: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title_es">{translations['admin.event_types.title_es']}</Label>
                                <Input
                                    id="title_es"
                                    value={formData.title_display_translation_es}
                                    onChange={(e) => setFormData({ ...formData, title_display_translation_es: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="title_ru">{translations['admin.event_types.title_ru']}</Label>
                                <Input
                                    id="title_ru"
                                    value={formData.title_display_translation_ru}
                                    onChange={(e) => setFormData({ ...formData, title_display_translation_ru: e.target.value })}
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

            {/* Delete Alert Dialog */}
            <AlertDialog open={dialogType === 'delete'} onOpenChange={closeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{translations['admin.event_types.delete']}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {translations['admin.event_types.confirm_delete']}
                            <br />
                            <strong>{selectedEventType?.system_event_title}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{translations['actions.cancel']}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {translations['actions.delete']}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

