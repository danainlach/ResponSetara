import React from 'react';
import { CheckCircle2, XCircle, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
    active?: boolean;
    trashed?: boolean;
    verified?: boolean;
    label?: string;
}

export default function StatusBadge({ active, trashed, verified, label }: StatusBadgeProps) {
    if (trashed) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-800 bg-red-950/60 px-2.5 py-0.5 text-xs font-medium text-red-300">
                <Trash2 className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                <span>Terhapus Sementara</span>
            </span>
        );
    }

    if (verified !== undefined) {
        return verified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800 bg-blue-950/60 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                <span>Terverifikasi</span>
            </span>
        ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800 bg-amber-950/60 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>Belum Verifikasi</span>
            </span>
        );
    }

    return active ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>{label || 'Aktif (Publik)'}</span>
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            <XCircle className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            <span>{label || 'Nonaktif (Draft)'}</span>
        </span>
    );
}
