import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;
    const { resolvedAppearance } = useAppearance();

    // Apply / remove html.dark so Tailwind's dark: variants and the .dark {}
    // CSS block fully activate inside the admin portal.
    // The cleanup runs on unmount (Inertia navigation to non-admin pages),
    // so public pages and auth pages are never affected.
    useEffect(() => {
        const html = document.documentElement;

        if (resolvedAppearance === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        return () => {
            html.classList.remove('dark');
        };
    }, [resolvedAppearance]);

    const outerClasses = cn(
        'admin-shell',
        resolvedAppearance === 'dark' && 'dark',
        'min-h-screen bg-background text-foreground'
    );

    if (variant === 'header') {
        return (
            <div data-admin-theme={resolvedAppearance} className={cn(outerClasses, 'flex w-full flex-col')}>
                {children}
            </div>
        );
    }

    return (
        <div data-admin-theme={resolvedAppearance} className={outerClasses}>
            <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>
        </div>
    );
}
