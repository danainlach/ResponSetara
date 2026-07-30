import React from 'react';
import { Head } from '@inertiajs/react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import AdminPagination from '@/components/admin/AdminPagination';

interface StatisticItem {
    id: number;
    event_type: string;
    event_date: string;
    category_slug?: string | null;
    total_count: number;
}

interface PageProps {
    statistics: { data: StatisticItem[]; links: any[]; total: number };
    filters: { event_type?: string; category_slug?: string };
}

export default function AdminStatisticsIndex({ statistics, filters }: PageProps) {
    const eventTypes = [
        { value: 'page_view_assistance', label: 'Page View: Butuh Bantuan' },
        { value: 'page_view_nonverbal', label: 'Page View: Tidak Dapat Berbicara' },
        { value: 'page_view_deaf', label: 'Page View: Tidak Dapat Mendengar' },
        { value: 'message_composed', label: 'Aktivasi: Pesan Disusun (Deterministik)' },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'Statistik Agregat (Read-Only)', href: '/admin/statistics' }]}>
            <Head title="Statistik Agregat — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl flex items-center gap-3">
                        <BarChart3 className="h-7 w-7 text-red-500 shrink-0" />
                        <span>Statistik Penggunaan Agregat</span>
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Metrik kuantitatif sistem berformat Read-Only. Sistem berkomitmen 100% pada privasi: tidak mencatat pesan, audio, lokasi, ataupun identitas masyarakat.
                    </p>
                </header>

                <div className="flex items-center gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-emerald-200">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                        <strong>Jaminan Zero-Retention Privacy:</strong> Tabel ini murni menampilkan angka hitungan harian per tipe peristiwa. Data individu tidak disimpan atau dilacak dalam bentuk apa pun.
                    </span>
                </div>

                <SearchFilterBar
                    routePath="/admin/statistics"
                    showTrashedFilter={false}
                    extraFilters={[{ name: 'event_type', label: 'Tipe Peristiwa', value: filters.event_type || '', options: eventTypes }]}
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Statistik Agregat" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Tanggal Statistik</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Tipe Peristiwa (Event Type)</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Kategori Terkait</th>
                                <th scope="col" className="px-4 py-3 text-right font-semibold">Total Hitungan (Count)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {statistics.data.length > 0 ? (
                                statistics.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-300 font-semibold">{item.event_date}</td>
                                        <td className="px-4 py-3.5"><span className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-mono text-amber-300 font-semibold">{item.event_type}</span></td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-400">{item.category_slug ? `/${item.category_slug}` : 'Umum / Semua Kategori'}</td>
                                        <td className="px-4 py-3.5 text-right font-mono text-base font-extrabold text-white">{item.total_count.toLocaleString('id-ID')} <span className="text-xs font-normal text-zinc-500">kali</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="px-4 py-12 text-center text-zinc-500">Belum ada catatan statistik agregat harian.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={statistics.links} total={statistics.total} />
            </div>
        </AdminLayout>
    );
}
