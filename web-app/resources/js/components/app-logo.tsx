import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm">
                <ShieldCheck className="size-5 text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-base tracking-tight text-zinc-100">
                    Respon<span className="text-teal-400">Setara</span>
                </span>
                <span className="truncate text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    Admin Portal
                </span>
            </div>
        </>
    );
}
