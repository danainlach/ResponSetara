import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { LayoutGrid } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center gap-1 sm:gap-2 text-xs md:text-sm">
                        {/* Always show a tiny home/dashboard icon at the start */}
                        <BreadcrumbItem>
                            <Link 
                                href="/admin" 
                                className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground/80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105 active:scale-95"
                                title="Dashboard Ringkasan Admin"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-muted-foreground/30 [&>svg]:size-3" />

                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            // If we are on the dashboard itself, show a styled pulsing badge
                            if (item.href === '/admin' && breadcrumbs.length === 1) {
                                return (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3.5 py-1 text-xs md:text-sm font-semibold tracking-wide text-teal-600 dark:border-teal-400/20 dark:bg-teal-950/30 dark:text-teal-300 shadow-xs">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                                                </span>
                                                {item.title}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </Fragment>
                                );
                            }

                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3.5 py-1 text-xs md:text-sm font-semibold tracking-wide text-teal-600 dark:border-teal-400/20 dark:bg-teal-950/30 dark:text-teal-300 shadow-xs">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild className="text-muted-foreground transition-colors hover:text-foreground font-medium">
                                                <Link href={item.href}>
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="text-muted-foreground/30 [&>svg]:size-3" />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
