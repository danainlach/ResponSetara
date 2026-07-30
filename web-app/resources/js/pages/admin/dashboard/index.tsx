import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Bot,
    CheckCircle2,
    Database,
    FileText,
    Layers,
    MessageSquare,
    PhoneCall,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Stats {
    active_categories: number;
    active_conditions: number;
    active_assistance_types: number;
    active_phrases: number;
    active_guides: number;
    verified_contacts: number;
    inactive_contents: number;
    active_ai_prompts: number;
}

interface ActivityLog {
    id: number;
    action: string;
    target_type?: string;
    target_id?: number;
    description?: string;
    ip_address?: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface DashboardProps {
    stats: Stats;
    recentLogs: ActivityLog[];
}

export default function AdminDashboardPage({ stats, recentLogs }: DashboardProps) {
    const statCards = [
        { title: 'Kategori Aktif', count: stats.active_categories, icon: Layers, color: 'emerald', href: '/admin/categories' },
        { title: 'Kondisi Aktif', count: stats.active_conditions, icon: Activity, color: 'emerald', href: '/admin/conditions' },
        { title: 'Jenis Bantuan Aktif', count: stats.active_assistance_types, icon: ShieldCheck, color: 'emerald', href: '/admin/assistance-types' },
        { title: 'Frasa Cepat Aktif', count: stats.active_phrases, icon: MessageSquare, color: 'blue', href: '/admin/quick-phrases' },
        { title: 'Panduan Aktif', count: stats.active_guides, icon: Database, color: 'blue', href: '/admin/helper-guides' },
        { title: 'Kontak Terverifikasi', count: stats.verified_contacts, icon: PhoneCall, color: 'purple', href: '/admin/emergency-contacts' },
        { title: 'Konten Nonaktif / Draft', count: stats.inactive_contents, icon: FileText, color: 'amber', href: '/admin/site-contents' },
        { title: 'Prompt AI Aktif', count: stats.active_ai_prompts, icon: Bot, color: 'red', href: '/admin/ai-prompts' },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard Ringkasan Admin', href: '/admin' }]}>
            <Head title="Dashboard Ringkasan — CMS Administrator ResponSetara" />

            <div className="mx-auto max-w-7xl space-y-8 py-2">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                            Portal Administrator ResponSetara
                        </h1>
                        <p className="mt-1 text-sm text-zinc-400">
                            Kelola seluruh konten, frasa darurat, dan parameter AI yang melayani masyarakat pada antarmuka publik.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3.5 py-1.5 border border-emerald-800 text-xs font-semibold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                        <span>Kebijakan Zero-Retention Aktif</span>
                    </div>
                </header>

                <section aria-labelledby="stat-heading">
                    <h2 id="stat-heading" className="text-lg font-semibold text-zinc-100 mb-4">
                        Ringkasan Metrik Data Sistem
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                        {item.title}
                                    </span>
                                    <item.icon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold tracking-tight text-white">
                                        {item.count}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">item</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="activity-heading" className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 id="activity-heading" className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                                <Users className="h-5 w-5 text-red-500" aria-hidden="true" />
                                <span>Aktivitas Administratif Terbaru</span>
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                Hanya mencatat metadata aksi CMS yang aman. Tidak merekam percakapan, transkripsi, audio, maupun lokasi.
                            </p>
                        </div>
                        <Link
                            href="/admin/activity-logs"
                            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                        >
                            Lihat Semua Log →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table aria-label="Tabel Log Aktivitas Terakhir" className="w-full text-left text-sm text-zinc-300">
                            <thead className="border-b border-zinc-800 bg-zinc-950/60 text-xs uppercase text-zinc-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-semibold">Waktu</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Administrator</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Aksi</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Target Modul</th>
                                    <th scope="col" className="px-4 py-3 font-semibold">Ringkasan Aman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                                                {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-200">
                                                {log.user?.name || 'Sistem / Superadmin'}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span className="inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono font-bold text-zinc-300">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs font-mono text-zinc-400">
                                                {log.target_type || 'N/A'} {log.target_id ? `(#${log.target_id})` : ''}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-300 max-w-md truncate">
                                                {log.description}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500 font-medium">
                                            Belum ada aktivitas administratif tercatat di dalam sistem.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
