import React from 'react';
import type { CommunicationModeCard } from '../../../types/public-api';

interface EnhancedModeCard extends CommunicationModeCard {
    icon: string;
    functionLabel: string;
    url: string;
    bgHover: string;
    borderStyle: string;
    badgeStyle: string;
    ctaColor: string;
}

const MODES: EnhancedModeCard[] = [
    {
        id: 'help-me',
        title: 'Saya Butuh Bantuan',
        description: 'Susun pesan pertolongan darurat terstruktur yang siap dibagikan ke aplikasi pesan atau dibacakan kepada penolong sekitar tanpa perlu login.',
        ariaLabel: 'Buka Mode Saya Butuh Bantuan untuk Susun Pesan Darurat',
        badgeColor: 'bg-white',
        icon: '🆘',
        functionLabel: 'Susun & Bagikan Pesan Darurat',
        url: '/bantuan-darurat',
        bgHover: 'hover:border-coral-600/60 hover:shadow-xl',
        borderStyle: 'border-coral-500/30 bg-gradient-to-b from-coral-50/40 to-white',
        badgeStyle: 'bg-coral-100 text-coral-800 border-coral-300',
        ctaColor: 'bg-coral-600 text-white group-hover:bg-coral-600/90',
    },
    {
        id: 'cannot-speak',
        title: 'Saya Tidak Dapat Berbicara',
        description: 'Ketik atau pilih frasa darurat terstandar dari daftar frasa resmi, lalu bacakan langsung melalui Text-to-Speech secara mandiri dan aman.',
        ariaLabel: 'Buka Mode Saya Tidak Dapat Berbicara (Nonverbal) untuk Teks ke Suara',
        badgeColor: 'bg-white',
        icon: '🔊',
        functionLabel: 'Teks ke Suara',
        url: '/tidak-dapat-berbicara',
        bgHover: 'hover:border-teal-600/60 hover:shadow-xl',
        borderStyle: 'border-teal-600/30 bg-gradient-to-b from-teal-50/40 to-white',
        badgeStyle: 'bg-teal-100 text-teal-800 border-teal-300',
        ctaColor: 'bg-teal-700 text-white group-hover:bg-teal-800',
    },
    {
        id: 'cannot-hear',
        title: 'Saya Tidak Dapat Mendengar',
        description: 'Ubah ucapan penolong atau tenaga medis menjadi teks font besar secara seketika melalui Speech-to-Text tanpa merekam audio.',
        ariaLabel: 'Buka Mode Saya Tidak Dapat Mendengar (Tuli) untuk Suara ke Teks',
        badgeColor: 'bg-white',
        icon: '💬',
        functionLabel: 'Suara ke Teks',
        url: '/tidak-dapat-mendengar',
        bgHover: 'hover:border-navy-800/60 hover:shadow-xl',
        borderStyle: 'border-slate-300 bg-gradient-to-b from-slate-50 to-white',
        badgeStyle: 'bg-navy-900 text-white border-navy-800',
        ctaColor: 'bg-navy-900 text-white group-hover:bg-navy-800',
    }
];

export default function CommunicationModesSection() {
    return (
        <section id="modes" aria-labelledby="modes-heading" className="py-6 sm:py-10 scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <h2 id="modes-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">
                    Pilih Mode Komunikasi Darurat
                </h2>
                <p className="text-base sm:text-lg text-ink-600 font-medium">
                    Pilih mode yang sesuai dengan situasi krisis Anda saat ini. Setiap jalur siap bekerja mandiri langsung di browser tanpa instalasi tambahan.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {MODES.map((mode) => (
                    <a
                        key={mode.id}
                        href={mode.url}
                        aria-label={mode.ariaLabel}
                        className={`group rounded-3xl border-2 p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all duration-200 motion-safe:hover:-translate-y-1.5 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 ${mode.borderStyle} ${mode.bgHover}`}
                    >
                        <div>
                            {/* Card Top Header & Status Badge */}
                            <div className="flex items-center justify-between gap-2 mb-6">
                                <span aria-hidden="true" className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-slate-200/80 group-hover:scale-105 transition-transform motion-reduce:transition-none">
                                    {mode.icon}
                                </span>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-600/30">
                                        <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                                        <span>Siap Digunakan</span>
                                    </span>
                                    <span className={`inline-block rounded-lg px-2.5 py-0.5 text-xs font-black border uppercase tracking-wider ${mode.badgeStyle}`}>
                                        {mode.functionLabel}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-3 tracking-tight group-hover:text-teal-800 transition-colors">
                                {mode.title}
                            </h3>
                            
                            <p className="text-sm sm:text-base text-ink-600 leading-relaxed font-semibold mb-8">
                                {mode.description}
                            </p>
                        </div>
                        
                        {/* Fake Button visual CTA (No nested interactive button inside link!) */}
                        <div
                            aria-hidden="true"
                            className={`w-full min-h-[52px] inline-flex items-center justify-center rounded-2xl font-extrabold text-base shadow-md transition-all group-hover:shadow-lg ${mode.ctaColor}`}
                        >
                            <span>Mulai Mode Ini</span>
                            <span className="ml-2.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none">➔</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
