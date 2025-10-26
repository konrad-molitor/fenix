import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations } = usePage<SharedData>().props;

    const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
        let translation = translations[key] || fallback || key;
        
        // Replace {{variable}} with actual values
        if (params) {
            Object.keys(params).forEach((param) => {
                const regex = new RegExp(`{{${param}}}`, 'g');
                translation = translation.replace(regex, String(params[param]));
            });
        }
        
        return translation;
    };

    return { t };
}
