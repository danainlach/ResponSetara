import React from 'react';
import { Head } from '@inertiajs/react';
import { History, ShieldCheck } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import AdminPagination from '@/components/admin/AdminPagination';

interface ActivityLogItem {
    id: number;
    user?: { id: number; name: string; email: string };
    action: string;
    target_type?: string | null;
    target_id?: number | null;
    description?: string | null;
    ip_address?: string | null;
    created_at: string;
}

interface PageProps {
    logs: { data: ActivityLogItem[]; links: any[]; total: number };
    filters: { search?: string };
}

export default function AdminActivityLogsIndex({ logs, filters }: PageProps) {
    return (
        <>
            <Head title="Audit Trail & Log Aktivitas Admin — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl flex items-center gap-3">
                        <History className="h-7 w-7 text-red-500 shrink-0" />
                        <span>Log Aktivitas & Audit Trail Admin</span>
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Rekam jejak tindakan admin dalam memodifikasi konten, kontak, dan parameter AI berformat Read-Only.
                    </p>
                </header>

                <div className="flex items-center gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-emerald-200">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                        <strong>Keamanan Log Tanpa Rahasia (No-Secret Logging):</strong> System secara otomatis membersihkan dan membatasi log hanya pada kesimpulan tindakan CMS. Token, kata sandi, dan kredensial basis data tidak pernah disimpulkan.
                    </span>
                </div>

                <SearchFilterBar
                    routePath="/admin/activity-logs"
                    initialSearch={filters.search}
                    showTrashedFilter={false}
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Log Aktivitas Admin" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Waktu Eksekusi</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Administrator</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Tipe Aksi</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Target Modul & ID</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Deskripsi Aktivitas Aman</th>
                                <th scope="col" className="px-4 py-3 text-right font-semibold">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {logs.data.length > 0 ? (
                                logs.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-zinc-400">
                                            {new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })}
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="font-semibold text-white">{item.user?.name || 'Superadmin / Sistem'}</div>
                                            <div className="text-[11px] text-zinc-500 font-mono">{item.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className={`rounded px-2.5 py-1 text-xs font-mono font-extrabold uppercase ${
                                                item.action.includes('DELETE') ? 'bg-red-950 text-red-400 border border-red-800/60' :
                                                item.action.includes('CREATE') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                                                'bg-zinc-800 text-zinc-200'
                                            }`}>
                                                {item.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-amber-400 whitespace-nowrap">
                                            {item.target_type || 'N/A'} {item.target_id ? `(#${item.target_id})` : ''}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-300 max-w-md truncate">
                                            {item.description || 'Tidak ada deskripsi rinci.'}
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-500 text-right whitespace-nowrap">
                                            {item.ip_address || '127.0.0.1'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">Belum ada catatan aktivitas administratif yang terekam di dalam log.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={logs.links} total={logs.total} />
        </div>
        </>
    );
}

AdminActivityLogsIndex.layout = AdminPersistentLayout;
AdminActivityLogsIndex.breadcrumbs = [{ title: 'Log Aktivitas Admin (Read-Only)', href: '/admin/activity-logs' }];
