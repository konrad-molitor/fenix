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
import { useTranslation } from '@/hooks/use-translation';

interface Point {
    id: number;
    title: string | null;
    description: string | null;
    type: string;
    latitude: number;
    longitude: number;
    user: {
        id: number;
        name: string;
    };
    is_own: boolean;
    created_at: string;
}

interface DeletePointDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    point: Point | null;
    onConfirm: () => void;
}

export function DeletePointDialog({ open, onOpenChange, point, onConfirm }: DeletePointDialogProps) {
    const { t } = useTranslation();

    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    if (!point) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('map.delete_point_title', 'Delete Point')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('map.delete_point_description', 'Are you sure you want to delete this point? This action cannot be undone.')}
                        <br />
                        <br />
                        <strong>{point.title || t('map.untitled_point', 'Untitled Point')}</strong>
                        <br />
                        <span className="text-xs text-muted-foreground">
                            {Number(point.latitude).toFixed(6)}, {Number(point.longitude).toFixed(6)}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {t('actions.cancel', 'Cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {t('map.delete', 'Delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
