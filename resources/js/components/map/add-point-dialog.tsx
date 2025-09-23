import { useState, useEffect } from 'react';
import { Camera, Video } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Position {
    lat: number;
    lng: number;
}

interface AddPointDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    position: Position | null;
    onGetAddress?: (lat: number, lng: number) => Promise<string>;
    onSave?: (data: { title: string; type: string; description?: string }) => void;
}

type EventType = 'incident' | 'crime' | 'event';

const eventTypes: { type: EventType; color: 'orange' | 'destructive' | 'secondary' }[] = [
    { type: 'incident', color: 'orange' as const },
    { type: 'crime', color: 'destructive' },
    { type: 'event', color: 'secondary' },
];

export function AddPointDialog({ open, onOpenChange, position, onGetAddress, onSave }: AddPointDialogProps) {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState<EventType | null>(null);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState<string>('');
    const [loadingAddress, setLoadingAddress] = useState(false);

    // Load address when dialog opens
    useEffect(() => {
        if (open && position && onGetAddress) {
            setLoadingAddress(true);
            setAddress('');
            
            onGetAddress(position.lat, position.lng)
                .then(setAddress)
                .catch(() => setAddress(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`))
                .finally(() => setLoadingAddress(false));
        }
    }, [open, position, onGetAddress]);

    const handleSave = () => {
        if (!position || !selectedType || !title.trim()) {
            return;
        }

        if (onSave) {
            onSave({
                title: title.trim(),
                type: selectedType,
                description: address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
            });
        }

        // Reset form
        setSelectedType(null);
        setTitle('');
        onOpenChange(false);
    };

    const handleClose = () => {
        setSelectedType(null);
        setTitle('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('map.add_point_title', 'Add point')}</DialogTitle>
                    <DialogDescription>
                        {t('map.add_point_description', 'Create a new point on the map')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Address Display */}
                    {position && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('map.location', 'Location')}
                            </Label>
                            <div className="text-sm bg-muted/50 rounded-md p-2">
                                {loadingAddress ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        {t('map.loading_address', 'Loading address...')}
                                    </div>
                                ) : (
                                    address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
                                )}
                            </div>
                        </div>
                    )}

                    {/* Event Type Selection */}
                    <div className="space-y-2">
                        <Label>{t('map.event_type', 'Event type')}</Label>
                        <div className="flex gap-2 flex-wrap">
                            {eventTypes.map(({ type, color }) => (
                                <Badge
                                    key={type}
                                    variant={selectedType === type ? 'default' : 'outline'}
                                    className={`cursor-pointer transition-colors ${
                                        selectedType === type 
                                            ? color === 'orange' 
                                                ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                                                : color === 'destructive'
                                                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                                                : 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                                            : color === 'orange'
                                            ? 'hover:bg-orange-50 border-orange-200 text-orange-700'
                                            : color === 'destructive'
                                            ? 'hover:bg-red-50 border-red-200 text-red-700'
                                            : 'hover:bg-green-50 border-green-200 text-green-700'
                                    }`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {t(`map.event_type.${type}`, type)}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Attachment Buttons */}
                    <div className="space-y-2">
                        <Label>{t('map.attachments', 'Attachments')}</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled
                                className="opacity-50"
                            >
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">{t('map.attach_photo', 'Attach photo')}</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled
                                className="opacity-50"
                            >
                                <Video className="h-4 w-4" />
                                <span className="sr-only">{t('map.attach_video', 'Attach video')}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="title">{t('map.title', 'Title')}</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, 255))}
                            placeholder={t('map.title_placeholder', 'Enter title (up to 255 characters)')}
                            maxLength={255}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {title.length}/255
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleClose}>
                        {t('actions.cancel', 'Cancel')}
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={!selectedType || !title.trim()}
                    >
                        {t('actions.save', 'Save')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}