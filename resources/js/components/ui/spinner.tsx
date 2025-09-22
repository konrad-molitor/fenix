import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
    'animate-spin rounded-full border-2 border-current border-t-transparent',
    {
        variants: {
            size: {
                '1': 'h-4 w-4',
                '2': 'h-6 w-6',
                '3': 'h-8 w-8',
            },
        },
        defaultVariants: {
            size: '2',
        },
    }
);

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
    loading?: boolean;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
    ({ className, size, loading = true, children, ...props }, ref) => {
        if (!loading && children) {
            return <>{children}</>;
        }

        if (!loading) {
            return null;
        }

        return (
            <span
                ref={ref}
                className={cn(spinnerVariants({ size }), className)}
                {...props}
            />
        );
    }
);

Spinner.displayName = 'Spinner';

export { Spinner };
