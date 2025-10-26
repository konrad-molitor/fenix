import { useState, useEffect, useRef } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';
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
    onSave?: (data: { title: string; type: string; description?: string; images?: File[] }) => void;
}

type EventType = 'incident' | 'crime' | 'event';

const eventTypes: { type: EventType; color: 'orange' | 'destructive' | 'secondary' }[] = [
    { type: 'incident', color: 'orange' as const },
    { type: 'crime', color: 'destructive' },
    { type: 'event', color: 'secondary' },
];

export function AddPointDialog({ open, onOpenChange, position, onGetAddress, onSave }: AddPointDialogProps) {
    const { t } = useTranslation();
    const { error } = useNotification();
    const [selectedType, setSelectedType] = useState<EventType | null>(null);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState<string>('');
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_IMAGES = 3;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        
        const validFiles: File[] = [];
        const errors: string[] = [];
        
        files.forEach(file => {
            if (!allowedTypes.includes(file.type.toLowerCase())) {
                errors.push(`${file.name}: ${t('map.error_wrong_format', 'Only JPEG and PNG formats are allowed')}`);
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: ${t('map.error_file_too_large', 'File size must be less than 5MB')}`);
                return;
            }
            validFiles.push(file);
        });
        
        if (errors.length > 0) {
            errors.forEach(err => error(err, t('map.error', 'Error')));
        }

        const remainingSlots = MAX_IMAGES - selectedImages.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);

        if (filesToAdd.length < validFiles.length) {
            error(t('map.error_max_images', `Maximum ${MAX_IMAGES} images allowed`), t('map.error', 'Error'));
        }

        Promise.all(
            filesToAdd.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })
        ).then((newPreviews) => {
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }).catch((err) => {
            console.error('Error reading image files:', err);
            error(t('map.error', 'Error reading image files'), t('map.error', 'Error'));
        });

        setSelectedImages(prev => [...prev, ...filesToAdd]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!position || !selectedType || !title.trim()) {
            return;
        }

        if (onSave) {
            onSave({
                title: title.trim(),
                type: selectedType,
                description: address || `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`,
                images: selectedImages,
            });
        }

        // Reset form
        setSelectedType(null);
        setTitle('');
        setSelectedImages([]);
        setImagePreviews([]);
        onOpenChange(false);
    };

    const handleClose = () => {
        setSelectedType(null);
        setTitle('');
        setSelectedImages([]);
        setImagePreviews([]);
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

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>{t('map.photos', 'Photos')} ({selectedImages.length}/{MAX_IMAGES})</Label>
                        
                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={preview} 
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Upload Button */}
                        {selectedImages.length < MAX_IMAGES && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                >
                                    <ImagePlus className="h-4 w-4 mr-2" />
                                    {t('map.add_photos', 'Add photos')} (max 3, 5MB each)
                                </Button>
                            </>
                        )}
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