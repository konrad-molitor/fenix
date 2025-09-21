import { HTMLAttributes } from 'react';

type AppLogoIconVariant = 'auto' | 'inverted' | 'light' | 'dark';

type Props = HTMLAttributes<HTMLSpanElement> & {
    variant?: AppLogoIconVariant;
};

export default function AppLogoIcon({ className, variant = 'auto', ...rest }: Props) {
    const lightImgClass =
        variant === 'light' ? 'block' : variant === 'dark' ? 'hidden' : variant === 'inverted' ? 'hidden dark:block' : 'block dark:hidden';

    const darkImgClass =
        variant === 'dark' ? 'block' : variant === 'light' ? 'hidden' : variant === 'inverted' ? 'block dark:hidden' : 'hidden dark:block';

    return (
        <span {...rest} className={className}>
            <img src="/logo-icon-light.png" alt="Logo" className={`h-full w-full ${lightImgClass}`} />
            <img src="/logo-icon-dark.png" alt="Logo" className={`h-full w-full ${darkImgClass}`} />
        </span>
    );
}
