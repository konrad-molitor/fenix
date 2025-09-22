import { useTranslation } from '@/hooks/use-translation';
import { useNotification } from '@/hooks/use-notification';
import { Button } from '@/components/ui/button';

export default function DashboardList() {
    const { t } = useTranslation();
    const { success, error, info } = useNotification();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
            <h1 className="text-2xl font-bold text-foreground">
                {t('dashboard.list', 'List')}
            </h1>
            <div className="flex gap-2">
                <Button 
                    onClick={() => success('List loaded successfully!', 'Success')}
                    variant="default"
                >
                    Success Toast
                </Button>
                <Button 
                    onClick={() => error('Error loading list', 'Error')}
                    variant="destructive"
                >
                    Error Toast
                </Button>
                <Button 
                    onClick={() => info('List information', 'Info')}
                    variant="outline"
                >
                    Info Toast
                </Button>
            </div>
        </div>
    );
}
