import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations } = usePage<SharedData>().props;

    const t = (key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    };

    return { t };
}
