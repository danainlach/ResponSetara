import React from 'react';
import { Link } from '@inertiajs/react';
import ResponSetaraLogo from '@/components/branding/ResponSetaraLogo';
import { home } from '@/routes';

interface AuthBrandLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthBrandLayout({
    children,
    title,
    description,
}: AuthBrandLayoutProps) {
    return (
        <div className="relative grid min-h-svh grid-cols-1 lg:grid-cols-[45fr_55fr] bg-[#F4F8FA] text-text-primary select-none">
            {/* Left Panel: Branding & Trust Info (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#082532] to-[#0B9F91] border-r border-[var(--border)] relative overflow-hidden text-white">
                <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-primary/10 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-coral-emergency/5 blur-3xl" />

                <div className="relative z-10">
                    <Link
                        href={home()}
                        className="inline-flex rounded-xl py-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-primary"
                        aria-label="Kembali ke beranda"
                    >
                        <ResponSetaraLogo markSize={36} showDescriptor={true} darkTheme={true} />
                    </Link>
                </div>

                <div className="relative z-10 space-y-6 my-auto max-w-md">
                    <h2 className="text-4xl font-black tracking-tight leading-tight">
                        Portal Administrasi ResponSetara
                    </h2>
                    <p className="text-base text-slate-100 leading-relaxed font-semibold">
                        Layanan autentikasi aman bagi administrator untuk mengelola direktori kontak, panduan penolong, serta meninjau performa statistik penggunaan agregat publik secara inklusif.
                    </p>
                    
                    <div className="space-y-4 pt-4">
                        <div className="flex items-start space-x-3.5">
                            <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold">
                                ✓
                            </span>
                            <div>
                                <p className="text-sm font-extrabold text-white">Keamanan Terjamin</p>
                                <p className="text-xs text-slate-200 font-semibold">Verifikasi multi-faktor dan passkey resmi untuk mengamankan data CMS.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3.5">
                            <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold">
                                ✓
                            </span>
                            <div>
                                <p className="text-sm font-extrabold text-white">Privasi Mutlak</p>
                                <p className="text-xs text-slate-200 font-semibold">Semua aktivitas pelaporan darurat tetap anonim tanpa perekaman identitas user.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-300 font-bold">
                    &copy; 2026 ResponSetara. Hak Cipta Dilindungi Undang-Undang.
                </div>
            </div>

            {/* Right Panel: Content Form */}
            <div className="flex items-center justify-center p-6 sm:p-10 md:p-16 bg-[#F4F8FA]">
                <div className="w-full max-w-[540px] md:w-[540px] space-y-8 bg-white border border-[var(--border)] p-10 sm:p-11 rounded-[24px] shadow-sm relative overflow-hidden">
                    
                    {/* Top Logo (Mobile Only) */}
                    <div className="flex flex-col items-center gap-6 lg:hidden text-center">
                        <Link
                            href={home()}
                            className="inline-flex rounded-xl py-1.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-primary"
                        >
                            <ResponSetaraLogo markSize={32} showDescriptor={false} darkTheme={false} />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black tracking-tight text-text-primary">{title}</h1>
                        <p className="text-base text-text-secondary font-semibold leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="relative z-10 text-text-primary">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
