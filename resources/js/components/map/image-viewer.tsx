import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageViewerProps {
    imageUrl: string;
    onClose: () => void;
}

export function ImageViewer({ imageUrl, onClose }: ImageViewerProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Image container */}
            <div
                className="relative max-w-[80vw] max-h-[80vh] animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt="Full size"
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
}

