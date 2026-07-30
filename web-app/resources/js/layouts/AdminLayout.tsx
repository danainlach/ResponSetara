import React, { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { BreadcrumbItem } from '@/types';

interface FlashProps {
    [key: string]: unknown;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AdminLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { flash } = usePage<FlashProps>().props;
    const currentToast = useMemo(
        () =>
            flash?.success
                ? { type: 'success' as const, text: flash.success }
                : flash?.error
                  ? { type: 'error' as const, text: flash.error }
                  : null,
        [flash]
    );
    const [dismissedText, setDismissedText] = useState<string | null>(null);

    useEffect(() => {
        if (!currentToast) {
            return;
        }

        const timer = setTimeout(() => {
            setDismissedText(currentToast.text);
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentToast]);

    const showToast = currentToast && dismissedText !== currentToast.text;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {showToast && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className={`fixed top-16 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${
                            currentToast.type === 'success'
                                ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200'
                                : 'border-red-500/30 bg-red-950/90 text-red-200'
                        }`}
                    >
                        {currentToast.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{currentToast.text}</span>
                        <button
                            type="button"
                            onClick={() => setDismissedText(currentToast.text)}
                            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Tutup notifikasi"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                <div className="flex-1 p-4 md:p-6">{children}</div>
            </AppContent>
        </AppShell>
    );
}
