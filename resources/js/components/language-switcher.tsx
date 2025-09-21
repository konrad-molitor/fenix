import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

interface PageProps {
    locale: string;
    availableLocales: Record<string, string>;
    [key: string]: unknown;
}

export function LanguageSwitcher() {
    const { locale, availableLocales } = usePage<PageProps>().props;
    const [isChanging, setIsChanging] = useState(false);

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === locale || isChanging) return;

        setIsChanging(true);
        
        // Use server route to switch locale
        router.post('/locale/switch', {
            locale: newLocale,
            redirect_to: window.location.pathname + window.location.search,
        }, {
            preserveScroll: true,
            onFinish: () => setIsChanging(false),
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-background shadow-lg border"
                        disabled={isChanging}
                    >
                        <Languages className="h-4 w-4" />
                        <span className="sr-only">Switch language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px]">
                    {Object.entries(availableLocales).map(([code, name]) => (
                        <DropdownMenuItem
                            key={code}
                            onClick={() => handleLanguageChange(code)}
                            className={`cursor-pointer ${
                                code === locale ? 'bg-accent' : ''
                            }`}
                        >
                            <span className="flex items-center justify-between w-full">
                                <span>{name}</span>
                                {code === locale && (
                                    <span className="text-xs text-muted-foreground ml-2">✓</span>
                                )}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
