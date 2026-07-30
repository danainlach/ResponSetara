import React from 'react';
import { router } from '@inertiajs/react';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface FilterOption {
    name: string;
    label: string;
    value: string;
    options: { value: string; label: string }[];
}

interface SearchFilterBarProps {
    routePath: string;
    initialSearch?: string;
    showTrashedFilter?: boolean;
    initialTrashed?: boolean;
    extraFilters?: FilterOption[];
    onOpenCreate?: () => void;
    createButtonLabel?: string;
}

export default function SearchFilterBar({
    routePath,
    initialSearch = '',
    showTrashedFilter = true,
    initialTrashed = false,
    extraFilters = [],
    onOpenCreate,
    createButtonLabel = 'Tambah Data',
}: SearchFilterBarProps) {
    const [search, setSearch] = React.useState(initialSearch);
    const prevSearchRef = React.useRef(initialSearch);

    React.useEffect(() => {
        // Trigger search automatically after 350ms of typing inactivity
        if (search === prevSearchRef.current) {
            return;
        }

        const handler = setTimeout(() => {
            prevSearchRef.current = search;
            router.get(
                routePath,
                { search, trashed: initialTrashed ? '1' : undefined },
                { preserveState: true, replace: true }
            );
        }, 350);

        return () => clearTimeout(handler);
    }, [search, routePath, initialTrashed]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        prevSearchRef.current = search;
        router.get(routePath, { search, trashed: initialTrashed ? '1' : undefined }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        prevSearchRef.current = '';
        router.get(routePath, {}, { preserveState: true, replace: true });
    };

    const toggleTrashed = () => {
        const nextTrashed = !initialTrashed;
        router.get(routePath, { search, trashed: nextTrashed ? '1' : undefined }, { preserveState: true, replace: true });
    };

    return (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari berdasarkan nama, kode, atau teks..."
                        aria-label="Kolom pencarian data CMS"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Cari
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label="Reset filter pencarian"
                            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {extraFilters.map((flt) => (
                    <div key={flt.name} className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                        <select
                            value={flt.value || ''}
                            onChange={(e) => {
                                router.get(routePath, { search, [flt.name]: e.target.value }, { preserveState: true });
                            }}
                            aria-label={`Filter berdasarkan ${flt.label}`}
                            className="min-h-[44px] rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-red-500 focus:outline-none"
                        >
                            <option value="">Semua {flt.label}</option>
                            {flt.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </form>

            <div className="flex items-center gap-3 self-end md:self-auto">
                {showTrashedFilter && (
                    <button
                        type="button"
                        onClick={toggleTrashed}
                        className={`inline-flex min-h-[44px] items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            initialTrashed
                                ? 'border-red-700 bg-red-950 text-red-300 shadow-sm'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                    >
                        {initialTrashed ? '📂 Tampilkan Data Aktif' : '🗑️ Tampilkan Sampah (Soft-Deleted)'}
                    </button>
                )}

                {onOpenCreate && (
                    <button
                        type="button"
                        onClick={onOpenCreate}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                        + {createButtonLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
