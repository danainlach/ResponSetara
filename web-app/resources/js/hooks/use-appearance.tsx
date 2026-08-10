import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();
let currentAppearance: Appearance = 'dark';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    const stored = localStorage.getItem('admin_appearance') as Appearance;

    return stored || 'dark';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (): void => {
    if (typeof document === 'undefined') {
        return;
    }
    
    // We intentionally DO NOT apply .dark to document.documentElement 
    // to prevent the theme from bleeding into the public pages.
    // The admin layouts will use the resolvedAppearance to scope the theme.
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (): void => {
    applyTheme();
    notify();
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('admin_appearance')) {
        localStorage.setItem('admin_appearance', 'dark');
        setCookie('admin_appearance', 'dark');
    }

    // Always delete legacy appearance cookie to prevent backend from adding .dark globally
    document.cookie = 'appearance=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('appearance');

    currentAppearance = getStoredAppearance();
    applyTheme();

    // FOUC prevention: apply html.dark early for admin/settings pages before React hydrates.
    // AppShell's useEffect will take over once the component mounts.
    const isAdminOrSettings = /^\/(admin|settings)/.test(window.location.pathname);

    if (isAdminOrSettings && isDarkMode(currentAppearance)) {
        document.documentElement.classList.add('dark');
    }

    // Set up system theme change listener
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(
        subscribe,
        () => currentAppearance,
        () => 'dark',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('admin_appearance', mode);

        // Store in cookie for SSR (if needed by specific admin layouts)...
        setCookie('admin_appearance', mode);

        applyTheme();
        notify();
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
