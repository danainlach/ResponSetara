import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<any>().props;
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const formatIndonesianDate = () => {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            const now = new Date();
            const dayName = days[now.getDay()];
            const date = now.getDate();
            const monthName = months[now.getMonth()];
            const year = now.getFullYear();
            return `${dayName}, ${date} ${monthName} ${year}`;
        };
        setCurrentTime(formatIndonesianDate());
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/30 bg-background/85 backdrop-blur-md px-6 transition-all duration-200 ease-in-out md:px-6">
            {/* Left Section: Navigation Controls & Breadcrumbs */}
            <div className="flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 rounded-lg border border-sidebar-border/60 bg-sidebar/30 transition-transform duration-150 hover:scale-105 active:scale-95" />
                <div className="h-4 w-[1px] bg-sidebar-border/50" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right Section: Premium Admin Info Widgets */}
            <div className="hidden items-center gap-3 sm:flex">
                {/* User Greeting Widget (if authenticated) */}
                {auth?.user && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                        <span>Halo,</span>
                        <span className="font-semibold text-foreground">{auth.user.name}</span>
                    </div>
                )}

                {/* Calendar Widget */}
                {currentTime && (
                    <div className="flex items-center gap-2 rounded-full border border-sidebar-border/50 bg-sidebar/20 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
                        <Calendar className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
                        <span>{currentTime}</span>
                    </div>
                )}

                {/* System Session Status Widget */}
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-xs">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    <span>Admin Active</span>
                </div>
            </div>
        </header>
    );
}
