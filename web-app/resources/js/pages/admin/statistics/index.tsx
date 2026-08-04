import React from 'react';
import { Head, router } from '@inertiajs/react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';

interface StatisticItem {
    id: number;
    event_type: string;
    event_date: string;
    category_slug?: string | null;
    count: number;
}

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
}

interface SummaryStats {
    total_opened: number;
    total_template: number;
    total_ai: number;
    total_fallback: number;
    total_today: number;
}

interface PageProps {
    statistics: { data: StatisticItem[]; links: any[]; total: number };
    filters: { event_type?: string; category_slug?: string; start_date?: string; end_date?: string };
    categories: CategoryItem[];
    summary?: SummaryStats;
}

const EVENT_TYPE_MAP: Record<string, string> = {
    assistance_mode_opened: 'Mode Bantuan Dibuka',
    nonverbal_mode_opened: 'Mode Teks ke Suara Dibuka',
    deaf_mode_opened: 'Mode Suara ke Teks Dibuka',
    message_composed_template: 'Pesan Template Disusun',
    message_composed_ai: 'Pesan Dirapikan dengan AI',
    ai_fallback_used: 'Fallback AI Digunakan',
    emergency_contacts_viewed: 'Kontak Darurat Dilihat',
};

export default function AdminStatisticsIndex({ statistics, filters, categories, summary }: PageProps) {
    const eventOptions = Object.entries(EVENT_TYPE_MAP).map(([value, label]) => ({ value, label }));

    const handleFilterChange = (key: string, value: string) => {
        const nextFilters = { ...filters, [key]: value || undefined };
        router.get('/admin/statistics', nextFilters, { preserveState: true });
    };

    const handleResetFilters = () => {
        router.get('/admin/statistics', {}, { preserveState: true });
    };

    // Calculate max count for scaling horizontal bar visualization
    const maxCount = Math.max(...statistics.data.map((item) => item.count), 1);

    return (
        <>
            <Head title="Statistik Aktivitas Sistem (Agregat) — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl flex items-center gap-3">
                        <BarChart3 className="h-7 w-7 text-teal-500 shrink-0" />
                        <span>Statistik Aktivitas Sistem (Agregat)</span>
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Statistik ini menunjukkan jumlah aktivitas sistem, bukan jumlah pengguna unik. ResponSetara tidak menyimpan identitas, pesan, lokasi, audio, ataupun transkripsi.
                    </p>
                </header>

                {/* Privacy Notice Box */}
                <div className="flex items-start gap-3 rounded-xl border border-teal-900/60 bg-teal-950/30 p-4 text-teal-200">
                    <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                        <span className="font-bold">Jaminan Zero-Retention Privacy:</span> ResponSetara hanya menyimpan hitungan aktivitas harian secara agregat. Sistem tidak menyimpan identitas pengguna, isi pesan, lokasi, audio, maupun transkripsi.
                    </div>
                </div>

                {/* Summary Cards with skeleton support */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Mode Opened card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Mode Dibuka</div>
                        {summary ? (
                            <div className="mt-2 text-2xl font-black text-white">{summary.total_opened.toLocaleString('id-ID')}</div>
                        ) : (
                            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">Bantuan, Nonverbal, & Tuli</div>
                    </div>

                    {/* Template composed card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pesan Template</div>
                        {summary ? (
                            <div className="mt-2 text-2xl font-black text-white">{summary.total_template.toLocaleString('id-ID')}</div>
                        ) : (
                            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">Pesan deterministik disusun</div>
                    </div>

                    {/* AI refined card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pesan AI</div>
                        {summary ? (
                            <div className="mt-2 text-2xl font-black text-white">{summary.total_ai.toLocaleString('id-ID')}</div>
                        ) : (
                            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">Refinement via Gemini AI</div>
                    </div>

                    {/* AI Fallbacks card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Fallback AI</div>
                        {summary ? (
                            <div className="mt-2 text-2xl font-black text-red-400">{summary.total_fallback.toLocaleString('id-ID')}</div>
                        ) : (
                            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">Penolakan / rate limit AI</div>
                    </div>

                    {/* Today activity card */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Aktivitas Hari Ini</div>
                        {summary ? (
                            <div className="mt-2 text-2xl font-black text-teal-400">{summary.total_today.toLocaleString('id-ID')}</div>
                        ) : (
                            <div className="mt-3 h-7 w-20 animate-pulse rounded bg-zinc-800" />
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">Total seluruh event hari ini</div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 lg:flex-row lg:items-center">
                    <div className="flex flex-wrap flex-1 gap-4 items-center">
                        {/* Event type filter */}
                        <div className="flex flex-col gap-1.5 min-w-[200px]">
                            <label className="text-xs font-bold text-zinc-400">Tipe Aktivitas</label>
                            <select
                                value={filters.event_type || ''}
                                onChange={(e) => handleFilterChange('event_type', e.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">Semua Aktivitas</option>
                                {eventOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category filter */}
                        <div className="flex flex-col gap-1.5 min-w-[200px]">
                            <label className="text-xs font-bold text-zinc-400">Kategori Terkait</label>
                            <select
                                value={filters.category_slug || ''}
                                onChange={(e) => handleFilterChange('category_slug', e.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"
                            >
                                <option value="">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Start */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-400">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={filters.start_date || ''}
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        {/* Date Range End */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-400">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={filters.end_date || ''}
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="self-end lg:self-auto pt-4 lg:pt-0">
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Statistik Aktivitas Agregat" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Tanggal</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Nama Aktivitas</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Kategori</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Visualisasi Jumlah</th>
                                <th scope="col" className="px-4 py-3 text-right font-semibold">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {statistics.data.length > 0 ? (
                                statistics.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-300 font-semibold">{item.event_date}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-mono text-teal-300 font-semibold">
                                                {EVENT_TYPE_MAP[item.event_type] || item.event_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-400">
                                            {item.category_slug ? `/${item.category_slug}` : 'Umum / Semua Kategori'}
                                        </td>
                                        {/* Horizontal Progress Bar Visualizer */}
                                        <td className="px-4 py-3.5 min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-full rounded bg-zinc-800 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded bg-gradient-to-r from-teal-600 to-teal-400"
                                                        style={{ width: `${Math.min(100, (item.count / maxCount) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono text-base font-extrabold text-white">
                                            {item.count.toLocaleString('id-ID')}{' '}
                                            <span className="text-xs font-normal text-zinc-500">kali</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-zinc-500 font-medium">
                                        Belum ada aktivitas sejak pencatatan statistik diaktifkan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={statistics.links} total={statistics.total} />
            </div>
        </>
    );
}

AdminStatisticsIndex.layout = AdminPersistentLayout;
AdminStatisticsIndex.breadcrumbs = [{ title: 'Statistik Aktivitas Sistem (Agregat)', href: '/admin/statistics' }];
