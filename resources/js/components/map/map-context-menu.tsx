import { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';


interface MapContextMenuProps {
    show: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    onAddPoint: () => void;
    onDeletePoint?: () => void; // optional, shown when acting on own marker
}

export function MapContextMenu({ show, position, onClose, onAddPoint, onDeletePoint }: MapContextMenuProps) {
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            ref={menuRef}
            className="fixed z-[1300] min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => {
                    onAddPoint();
                    onClose();
                }}
            >
                {t('map.add_here', 'Add point here')}
            </div>
            {onDeletePoint && (
                <div
                    className="relative mt-1 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => {
                        onDeletePoint();
                        onClose();
                    }}
                >
                    {t('map.delete', 'Delete')}
                </div>
            )}
        </div>
    );
}
