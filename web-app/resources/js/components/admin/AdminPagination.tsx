import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
    total?: number;
}

export default function AdminPagination({ links = [], total = 0 }: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav aria-label="Navigasi Halaman Data" className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-zinc-400">
                Total Data: <span className="font-semibold text-zinc-200">{total}</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {links.map((link, index) => {
                    const cleanLabel = link.label.replace('&laquo;', '«').replace('&raquo;', '»');

                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            className={`inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-md border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                link.active
                                    ? 'border-red-600 bg-red-600 text-white shadow-sm'
                                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                            aria-current={link.active ? 'page' : undefined}
                        >
                            <span dangerouslySetInnerHTML={{ __html: cleanLabel }} />
                        </Link>
                    ) : (
                        <span
                            key={index}
                            className="inline-flex min-h-[38px] min-w-[38px] cursor-not-allowed items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-sm font-medium text-zinc-600"
                            aria-disabled="true"
                        >
                            <span dangerouslySetInnerHTML={{ __html: cleanLabel }} />
                        </span>
                    );
                })}
            </div>
        </nav>
    );
}
