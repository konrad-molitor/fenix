import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { SharedData } from '@/types';
import { Table as RadixTable } from '@radix-ui/themes';
import { ReloadIcon, Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

interface Point {
    id: number;
    title: string | null;
    description: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    event_type_id: number | null;
    event_type: {
        id: number;
        system_event_title: string;
        priority: string;
    } | null;
    moderation_status: 'allow' | 'filtered';
    user: {
        id: number;
        name: string;
    };
    images: Array<{
        id: number;
        url: string;
        description: string | null;
        moderation_status: 'allow' | 'filtered';
        moderation_reason: string | null;
    }>;
    created_at: string;
    updated_at: string;
}

interface EventType {
    id: number;
    system_event_title: string;
    label: string;
}

interface Stats {
    total_24h: number;
    filtered_24h: number;
}

interface PaginatedResponse {
    data: Point[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

type ModerationFilter = 'show_filtered' | 'hide_filtered' | 'only_filtered';
type OrderBy = 'event_type_asc' | 'event_type_desc' | 'created_at_asc' | 'created_at_desc';

export default function AdminEvents() {
    const { translations } = usePage<SharedData>().props;
    const [stats, setStats] = useState<Stats | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [searchInDescriptions, setSearchInDescriptions] = useState(false);
    const [moderationFilter, setModerationFilter] = useState<ModerationFilter>('show_filtered');
    const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
    const [eventTypeInput, setEventTypeInput] = useState('');
    const [orderBy, setOrderBy] = useState<OrderBy>('created_at_desc');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/admin/events/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    // Fetch event types for autocomplete
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await axios.get('/admin/events/event-types');
                setEventTypes(response.data);
            } catch (error) {
                console.error('Failed to fetch event types:', error);
            }
        };

        fetchEventTypes();
    }, []);

    // Fetch points with filters
    const fetchPoints = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (search) params.append('search', search);
            if (searchInDescriptions) params.append('search_in_descriptions', '1');
            params.append('moderation_filter', moderationFilter);
            if (selectedEventTypes.length > 0) {
                selectedEventTypes.forEach(et => params.append('event_types[]', et.id.toString()));
            }
            params.append('order_by', orderBy);
            params.append('page', page.toString());

            const response = await axios.get<PaginatedResponse>(`/admin/events?${params.toString()}`);
            setPoints(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Failed to fetch points:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints(1);
    }, [search, searchInDescriptions, moderationFilter, selectedEventTypes, orderBy]);

    const handleAddEventType = (eventType: EventType) => {
        if (!selectedEventTypes.find(et => et.id === eventType.id)) {
            setSelectedEventTypes([...selectedEventTypes, eventType]);
        }
        setEventTypeInput('');
    };

    const handleRemoveEventType = (eventTypeId: number) => {
        setSelectedEventTypes(selectedEventTypes.filter(et => et.id !== eventTypeId));
    };

    const filteredEventTypes = eventTypes.filter(et =>
        et.label.toLowerCase().includes(eventTypeInput.toLowerCase()) &&
        !selectedEventTypes.find(set => set.id === et.id)
    );

    if (!stats) {
        return (
            <div className="flex justify-center items-center py-12">
                <ReloadIcon className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Statistics Cards */}

            {/* Filters and Table */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px] h-full min-h-0">
                {/* Main Content - Points Table */}
                
                <Card className="flex flex-col h-full overflow-hidden py-0">
                    <CardContent className="flex-1 flex flex-col p-4 overflow-hidden h-full">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <ReloadIcon className="h-6 w-6 animate-spin" />
                            </div>
                        ) : points.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {translations['admin.events.no_points'] || 'No points found'}
                            </div>
                        ) : (
                            <>
                                <div className="overflow-y-auto flex-1">
                                    <RadixTable.Root variant="surface" size="2">
                                    <RadixTable.Header>
                                        <RadixTable.Row>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.title_col'] || 'Title'}
                                            </RadixTable.ColumnHeaderCell>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.event_type'] || 'Event Type'}
                                            </RadixTable.ColumnHeaderCell>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.status'] || 'Status'}
                                            </RadixTable.ColumnHeaderCell>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.user'] || 'User'}
                                            </RadixTable.ColumnHeaderCell>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.images'] || 'Images'}
                                            </RadixTable.ColumnHeaderCell>
                                            <RadixTable.ColumnHeaderCell>
                                                {translations['admin.events.created'] || 'Created'}
                                            </RadixTable.ColumnHeaderCell>
                                        </RadixTable.Row>
                                    </RadixTable.Header>
                                    <RadixTable.Body>
                                        {points.map((point) => (
                                            <RadixTable.Row key={point.id}>
                                                <RadixTable.Cell>
                                                    <div className="max-w-[200px]">
                                                        <div className="font-medium truncate">
                                                            {point.title || translations['admin.events.untitled'] || 'Untitled'}
                                                        </div>
                                                        {point.address && (
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {point.address}
                                                            </div>
                                                        )}
                                                    </div>
                                                </RadixTable.Cell>
                                                <RadixTable.Cell>
                                                    {point.event_type ? (
                                                        <Badge variant="outline">
                                                            {point.event_type.system_event_title}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </RadixTable.Cell>
                                                <RadixTable.Cell>
                                                    <Badge variant={point.moderation_status === 'filtered' ? 'destructive' : 'secondary'}>
                                                        {point.moderation_status === 'filtered' 
                                                            ? (translations['moderation.filtered'] || 'Filtered')
                                                            : (translations['moderation.allowed'] || 'Allowed')
                                                        }
                                                    </Badge>
                                                </RadixTable.Cell>
                                                <RadixTable.Cell>
                                                    <div className="text-sm">{point.user.name}</div>
                                                </RadixTable.Cell>
                                                <RadixTable.Cell>
                                                    <div className="text-sm">{point.images.length}</div>
                                                </RadixTable.Cell>
                                                <RadixTable.Cell>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(point.created_at).toLocaleDateString()}
                                                    </div>
                                                </RadixTable.Cell>
                                            </RadixTable.Row>
                                        ))}
                                    </RadixTable.Body>
                                </RadixTable.Root>
                                </div>

                                {/* Pagination */}
                                {lastPage > 1 && (
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            {translations['admin.events.showing'] || 'Showing'} {points.length} {translations['admin.events.of'] || 'of'} {total}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => fetchPoints(currentPage - 1)}
                                            >
                                                {translations['admin.events.previous'] || 'Previous'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage === lastPage}
                                                onClick={() => fetchPoints(currentPage + 1)}
                                            >
                                                {translations['admin.events.next'] || 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar - Filters */}
                <div className="flex flex-col h-full overflow-hidden">
                    <Card className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="flex-shrink-0 pb-3">
                            <CardTitle className="text-sm">
                                {translations['admin.events.filters'] || 'Filters'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 overflow-y-auto flex-1 pt-0">
                            {/* Search */}
                            
                            <div className="space-y-2">
                                <Label htmlFor="search">
                                    {translations['admin.events.search'] || 'Search'}
                                </Label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder={translations['admin.events.search_placeholder'] || 'Search...'}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="searchInDescriptions"
                                        checked={searchInDescriptions}
                                        onChange={(e) => setSearchInDescriptions(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="searchInDescriptions" className="text-xs text-muted-foreground cursor-pointer">
                                        {translations['admin.events.search_in_descriptions'] || 'Search in photo descriptions'}
                                    </label>
                                </div>
                            </div>

                            {/* Moderation Filter */}
                            <div className="space-y-2">
                                <Label>
                                    {translations['admin.events.moderation_filter'] || 'Moderation Status'}
                                </Label>
                                <ToggleGroup.Root
                                    type="single"
                                    value={moderationFilter}
                                    onValueChange={(value) => value && setModerationFilter(value as ModerationFilter)}
                                    className="flex flex-col gap-1"
                                >
                                    <ToggleGroup.Item
                                        value="show_filtered"
                                        className="px-3 py-2 text-sm rounded border data-[state=on]:bg-accent data-[state=on]:border-primary hover:bg-accent/50 transition-colors"
                                    >
                                        {translations['admin.events.show_filtered'] || 'Show Filtered'}
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="hide_filtered"
                                        className="px-3 py-2 text-sm rounded border data-[state=on]:bg-accent data-[state=on]:border-primary hover:bg-accent/50 transition-colors"
                                    >
                                        {translations['admin.events.hide_filtered'] || 'Hide Filtered'}
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="only_filtered"
                                        className="px-3 py-2 text-sm rounded border data-[state=on]:bg-accent data-[state=on]:border-primary hover:bg-accent/50 transition-colors"
                                    >
                                        {translations['admin.events.only_filtered'] || 'Only Filtered'}
                                    </ToggleGroup.Item>
                                </ToggleGroup.Root>
                            </div>

                            {/* Event Type Autocomplete */}
                            <div className="space-y-2">
                                <Label htmlFor="eventType">
                                    {translations['admin.events.event_types'] || 'Event Types'}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="eventType"
                                        placeholder={translations['admin.events.type_to_search'] || 'Type to search...'}
                                        value={eventTypeInput}
                                        onChange={(e) => setEventTypeInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && filteredEventTypes.length > 0) {
                                                handleAddEventType(filteredEventTypes[0]);
                                            }
                                        }}
                                    />
                                    {eventTypeInput && filteredEventTypes.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                                            {filteredEventTypes.map(et => (
                                                <div
                                                    key={et.id}
                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                                                    onClick={() => handleAddEventType(et)}
                                                >
                                                    {et.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Selected Event Types */}
                                {selectedEventTypes.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {selectedEventTypes.map(et => (
                                            <Badge key={et.id} variant="secondary" className="gap-1">
                                                {et.label}
                                                <Cross2Icon
                                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                    onClick={() => handleRemoveEventType(et.id)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Order By */}
                            <div className="space-y-2">
                                <Label htmlFor="orderBy">
                                    {translations['admin.events.order_by'] || 'Order By'}
                                </Label>
                                <Select value={orderBy} onValueChange={(value) => setOrderBy(value as OrderBy)}>
                                    <SelectTrigger id="orderBy">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="created_at_desc">
                                            {translations['admin.events.created_desc'] || 'Created (Newest)'}
                                        </SelectItem>
                                        <SelectItem value="created_at_asc">
                                            {translations['admin.events.created_asc'] || 'Created (Oldest)'}
                                        </SelectItem>
                                        <SelectItem value="event_type_asc">
                                            {translations['admin.events.event_type_asc'] || 'Event Type (A-Z)'}
                                        </SelectItem>
                                        <SelectItem value="event_type_desc">
                                            {translations['admin.events.event_type_desc'] || 'Event Type (Z-A)'}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Reset Filters */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    setSearch('');
                                    setSearchInDescriptions(false);
                                    setModerationFilter('show_filtered');
                                    setSelectedEventTypes([]);
                                    setOrderBy('created_at_desc');
                                }}
                            >
                                {translations['admin.events.reset_filters'] || 'Reset Filters'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
