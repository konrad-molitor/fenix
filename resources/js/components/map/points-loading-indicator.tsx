import { Spinner } from '@/components/ui/spinner';

interface PointsLoadingIndicatorProps {
    show: boolean;
}

export function PointsLoadingIndicator({ show }: PointsLoadingIndicatorProps) {
    if (!show) return null;
    return (
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded shadow">
            <Spinner size="1" />
        </div>
    );
}


