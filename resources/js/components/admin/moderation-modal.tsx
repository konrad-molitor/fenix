import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Callout, Theme } from '@radix-ui/themes';
import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EventType {
    id: number;
    system_event_title: string;
    title_display_translation: Record<string, string>;
    label?: string;
}

interface PointImage {
    id: number;
    url: string;
    classified_type: number | null;
    classified_event_type: EventType | null;
    description: string | null;
    moderation_status: 'allow' | 'filtered' | 'declined';
    moderation_reason: string | null;
}

interface PointDetails {
    id: number;
    title: string | null;
    description: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    event_type_id: number | null;
    event_type: EventType | null;
    moderation_status: 'allow' | 'filtered' | 'declined';
    user: {
        id: number;
        name: string;
    };
    images: PointImage[];
    created_at: string;
    updated_at: string;
}

interface ModerationModalProps {
    open: boolean;
    pointId: number | null;
    onClose: () => void;
    onUpdate: () => void;
}

export default function ModerationModal({ open, pointId, onClose, onUpdate }: ModerationModalProps) {
    const { t } = useTranslation();
    const { success: showSuccess, error: showError } = useNotification();
    const [point, setPoint] = useState<PointDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [eventTypeInput, setEventTypeInput] = useState('');
    const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);

    const fetchEventTypes = useCallback(async () => {
        try {
            const response = await axios.get('/admin/events/event-types');
            setEventTypes(response.data);
        } catch (error) {
            console.error('Failed to fetch event types:', error);
        }
    }, []);

    const fetchPointDetails = useCallback(async () => {
        if (!pointId) return;
        
        setLoading(true);
        try {
            const response = await axios.get<PointDetails>(`/admin/events/${pointId}`);
            setPoint(response.data);
        } catch (error) {
            console.error('Failed to fetch point details:', error);
            showError('Failed to load event details');
            onClose();
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pointId]);

    useEffect(() => {
        if (open && pointId) {
            fetchPointDetails();
            fetchEventTypes();
        } else {
            setPoint(null);
            setEventTypeInput('');
            setShowEventTypeDropdown(false);
        }
    }, [open, pointId, fetchPointDetails, fetchEventTypes]);

    const handleApprove = async () => {
        if (!point) return;

        try {
            await axios.post(`/admin/events/${point.id}/approve`);
            showSuccess(t('admin.events.point_approved', 'Point approved successfully'));
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to approve point:', error);
            showError('Failed to approve point');
        }
    };

    const handleDecline = async () => {
        if (!point) return;

        try {
            await axios.post(`/admin/events/${point.id}/decline`);
            showSuccess(t('admin.events.point_declined', 'Point declined successfully'));
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to decline point:', error);
            showError('Failed to decline point');
        }
    };

    const handleClearImageModeration = async (imageId: number) => {
        if (!point) return;

        try {
            const response = await axios.post(`/admin/events/${point.id}/images/${imageId}/clear-moderation`);
            showSuccess(t('admin.events.moderation_cleared', 'Moderation cleared successfully'));
            
            // Update local state
            setPoint({
                ...point,
                moderation_status: response.data.point_status,
                images: point.images.map(img =>
                    img.id === imageId
                        ? { ...img, moderation_status: 'allow', moderation_reason: null }
                        : img
                ),
            });
            
            onUpdate();
        } catch (error) {
            console.error('Failed to clear image moderation:', error);
            showError('Failed to clear moderation');
        }
    };

    const handleEventTypeChange = async (eventTypeId: number) => {
        if (!point) return;

        try {
            await axios.patch(`/admin/events/${point.id}/event-type`, { event_type_id: eventTypeId });
            
            const selectedEventType = eventTypes.find(et => et.id === eventTypeId);
            
            setPoint({
                ...point,
                event_type_id: eventTypeId,
                event_type: selectedEventType ? {
                    id: selectedEventType.id,
                    system_event_title: selectedEventType.system_event_title,
                    title_display_translation: selectedEventType.title_display_translation,
                } : null,
            });
            
            setEventTypeInput('');
            setShowEventTypeDropdown(false);
            
            showSuccess('Event type updated successfully');
            
            onUpdate();
        } catch (error) {
            console.error('Failed to update event type:', error);
            showError('Failed to update event type');
        }
    };

    const filteredEventTypes = eventTypes.filter(et => {
        const searchText = eventTypeInput.toLowerCase();
        const matchesTitle = et.system_event_title.toLowerCase().includes(searchText);
        const matchesTranslation = et.title_display_translation && 
            Object.values(et.title_display_translation).some(val => 
                typeof val === 'string' && val.toLowerCase().includes(searchText)
            );
        return (matchesTitle || matchesTranslation) && et.id !== point?.event_type_id;
    });

    if (!point && !loading) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <Theme>
                    <DialogHeader>
                        <DialogTitle>
                            {t('admin.events.moderation_modal_title', 'Moderate Event')}
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : point ? (
                    <div className="space-y-6">
                        {/* Moderation Warning */}
                        {point.moderation_status !== 'allow' && (
                            <Callout.Root color="red" variant="surface" role="alert" size="1" className="mt-4">
                                <Callout.Icon>
                                    <ExclamationTriangleIcon />
                                </Callout.Icon>
                                <Callout.Text>
                                    {t('admin.events.moderation_warning', 'This event has been flagged by the AI moderation system')}
                                </Callout.Text>
                            </Callout.Root>
                        )}

                        {/* Point Details */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('admin.events.title_col', 'Title')}:
                                        </span>
                                        <p className="font-medium">
                                            {point.title || t('admin.events.untitled', 'Untitled')}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('admin.events.location', 'Location')}:
                                        </span>
                                        <p className="text-sm">
                                            {point.address || `${point.latitude}, ${point.longitude}`}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('admin.events.event_type', 'Event Type')}:
                                        </span>
                                        <div className="mt-1 relative">
                                            {point.event_type ? (
                                                <div className="flex flex-col gap-2">
                                                    <Badge variant="outline" className="w-fit">
                                                        {point.event_type.title_display_translation?.en || point.event_type.system_event_title}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setShowEventTypeDropdown(!showEventTypeDropdown)}
                                                        className="h-7 px-2 text-xs w-fit"
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowEventTypeDropdown(!showEventTypeDropdown)}
                                                    className="h-7 text-xs"
                                                >
                                                    Set Event Type
                                                </Button>
                                            )}
                                            
                                            {showEventTypeDropdown && (
                                                <div className="absolute z-10 mt-2 w-full max-w-sm">
                                                    <div className="bg-popover border rounded-md shadow-lg">
                                                        <div className="p-2">
                                                            <Input
                                                                placeholder="Search event types..."
                                                                value={eventTypeInput}
                                                                onChange={(e) => setEventTypeInput(e.target.value)}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="max-h-60 overflow-y-auto">
                                                            {filteredEventTypes.length > 0 ? (
                                                                filteredEventTypes.map((et) => (
                                                                    <div
                                                                        key={et.id}
                                                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                                                                        onClick={() => handleEventTypeChange(et.id)}
                                                                    >
                                                                        <div className="font-medium">{et.system_event_title}</div>
                                                                        {et.title_display_translation?.en && (
                                                                            <div className="text-xs text-muted-foreground">
                                                                                {et.title_display_translation.en}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                                                    No event types found
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('admin.events.status', 'Status')}:
                                        </span>
                                        <div className="mt-1">
                                            <Badge variant={point.moderation_status === 'allow' ? 'default' : 'destructive'}>
                                                {t(`moderation.${point.moderation_status}`, point.moderation_status)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground">
                                            {t('admin.events.user', 'User')}:
                                        </span>
                                        <p className="text-sm">{point.user.name}</p>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="h-64 rounded-md overflow-hidden border">
                                    <MapContainer
                                        center={[point.latitude, point.longitude]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[point.latitude, point.longitude]} />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        {/* Photos Section */}
                        {point.images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">
                                    {t('admin.events.photos', 'Photos')} ({point.images.length})
                                </h3>

                                <div className="space-y-6">
                                    {point.images.map((image) => (
                                        <div key={image.id} className="border rounded-lg p-4 space-y-3">
                                            {/* Image */}
                                            <a 
                                                href={image.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block relative w-full h-64 bg-gray-100 rounded-md overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt="Event"
                                                    className="w-full h-full object-contain"
                                                />
                                            </a>

                                            {/* Image Moderation Status */}
                                            {image.moderation_status !== 'allow' && (
                                                <div className="flex items-start gap-3">
                                                    <Callout.Root color="orange" variant="surface" size="2" className="flex-1">
                                                        <Callout.Icon>
                                                            <InfoCircledIcon />
                                                        </Callout.Icon>
                                                        <Callout.Text>
                                                            <span className="space-y-1 block">
                                                                <span className="font-medium block">
                                                                    {t('admin.events.moderation_issue', 'Moderation Issue')}:
                                                                </span>
                                                                <span className="text-sm block">
                                                                    {image.moderation_reason || t(`moderation.${image.moderation_status}`, image.moderation_status)}
                                                                </span>
                                                            </span>
                                                        </Callout.Text>
                                                    </Callout.Root>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearImageModeration(image.id);
                                                        }}
                                                        className="flex-shrink-0"
                                                    >
                                                        {t('admin.events.clear_moderation', 'Clear Moderation')}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Image Details */}
                                            <div className="flex flex-col gap-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t('admin.events.classified_as', 'Classified as')}:
                                                    </span>
                                                    <div className="mt-1">
                                                        {image.classified_event_type ? (
                                                            <Badge variant="secondary">
                                                                {image.classified_event_type.title_display_translation.en ||
                                                                    image.classified_event_type.system_event_title}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                {t('admin.events.na', 'N/A')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-muted-foreground">
                                                        {t('admin.events.ai_description', 'AI Description')}:
                                                    </span>
                                                    <p className="mt-1">
                                                        {image.description || t('admin.events.na', 'N/A')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                onClick={handleApprove}
                                size="lg"
                                className="flex-1"
                                variant="default"
                            >
                                {t('admin.events.approve', 'Approve')}
                            </Button>
                            <Button
                                onClick={handleDecline}
                                size="lg"
                                className="flex-1"
                                variant="destructive"
                            >
                                {t('admin.events.decline', 'Decline')}
                            </Button>
                        </div>

                        {/* Action Descriptions */}
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>
                                <strong>{t('admin.events.approve', 'Approve')}:</strong>{' '}
                                {t('admin.events.approve_confirm', 'This will clear all moderation flags and make the event visible to all users.')}
                            </p>
                            <p>
                                <strong>{t('admin.events.decline', 'Decline')}:</strong>{' '}
                                {t('admin.events.decline_confirm', 'This will hide the event from all users except the owner.')}
                            </p>
                        </div>
                    </div>
                ) : null}
                </Theme>
            </DialogContent>
        </Dialog>
    );
}

