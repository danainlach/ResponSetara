import React from 'react';
import type { SiteConfig } from '../../../types/public-api';
import { getConfigValue } from '../../../constants/fallback-config';

interface HeroSectionProps {
    configs: SiteConfig[];
}

export default function HeroSection({ configs }: HeroSectionProps) {
    const headline = getConfigValue(configs, 'landing_hero_headline', 'hero_headline');
    const description = getConfigValue(configs, 'landing_hero_description', 'hero_description');
    const primaryCta = getConfigValue(configs, 'landing_cta_primary', 'cta_primary_text');
    const secondaryCta = getConfigValue(configs, 'landing_cta_secondary', 'cta_secondary_text');
    const privacyNotice = getConfigValue(configs, 'privacy_notice_short', 'privacy_notice');

    return (
        <section aria-labelledby="hero-headline" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl my-4 border border-navy-800/80">
            {/* Subtle decorative glow (accessible, pointer-events-none, aria-hidden) */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-coral-600/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[380px]">
                {/* Left Column: Headline, Description, CTA, Privacy Notice */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-extrabold text-xs sm:text-sm tracking-wide shadow-xs">
                            <span aria-hidden="true">🌐</span>
                            <span>Darurat Cepat Tanpa Batas Audio-Verbal</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-navy-800 border border-slate-700 text-slate-300 font-bold text-xs">
                            ⚡ Tanpa Daftar &amp; Tanpa Login
                        </span>
                    </div>

                    <h1 id="hero-headline" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-xs">
                        {headline || 'Komunikasi darurat yang dapat dipahami semua orang.'}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                        {description || 'Ubah teks menjadi suara, suara menjadi teks, dan susun pesan darurat secara cepat melalui satu platform berkonteks lokal.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                        <a
                            href="#modes"
                            className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-coral-600 px-7 py-3 text-base font-extrabold text-white shadow-md hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white transition-all active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
                        >
                            <span>{primaryCta || 'Mulai Komunikasi'}</span>
                            <span aria-hidden="true" className="ml-2">➔</span>
                        </a>
                        <a
                            href="#how-it-works"
                            className="min-h-[48px] inline-flex items-center justify-center rounded-xl border-2 border-slate-300/80 bg-white/5 px-7 py-3 text-base font-bold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 transition-colors"
                        >
                            {secondaryCta || 'Cara Kerja'}
                        </a>
                    </div>

                    <div className="pt-2">
                        <div className="inline-flex items-center gap-2.5 rounded-2xl bg-navy-900/90 py-2.5 px-4 border border-teal-500/30 text-xs sm:text-sm text-teal-200 font-semibold shadow-inner">
                            <span aria-hidden="true" className="text-base">🔒</span>
                            <span>{privacyNotice || 'Pesan dan transkripsi tidak disimpan di server ResponSetara.'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Lightweight CSS Interactive Illustration (No large video/heavy media, accessible) */}
                <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                    <div aria-hidden="true" className="w-full max-w-md rounded-3xl bg-navy-900/80 border border-navy-700/60 p-6 shadow-2xl backdrop-blur-xs space-y-4 select-none pointer-events-none">
                        <div className="flex items-center justify-between pb-3 border-b border-navy-800 text-xs font-bold text-slate-300">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse motion-reduce:animate-none"></span>
                                <span>Sistem Respon Cepat</span>
                            </span>
                            <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-[11px] text-teal-300 font-bold border border-teal-500/30">
                                Tanpa Retensi Data
                            </span>
                        </div>

                        {/* Bubble 1: Bantuan Darurat */}
                        <div className="rounded-2xl bg-navy-800 p-3.5 border border-coral-500/30 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-coral-600 flex items-center justify-center text-white text-lg font-black shadow-md">
                                    🆘
                                </span>
                                <div>
                                    <p className="text-xs text-slate-300 font-medium">Bantuan Cepat</p>
                                    <p className="text-sm font-extrabold text-white">Informasi ➔ Pesan Darurat</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-coral-400">Siap &gt;</span>
                        </div>

                        {/* Connector line */}
                        <div className="h-4 w-0.5 bg-gradient-to-b from-coral-500/40 via-teal-500/40 to-teal-500/40 mx-8 my-0.5" />

                        {/* Bubble 2: Nonverbal TTS */}
                        <div className="rounded-2xl bg-navy-800 p-3.5 border border-teal-500/30 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-teal-700 flex items-center justify-center text-white text-lg font-black shadow-md">
                                    🔊
                                </span>
                                <div>
                                    <p className="text-xs text-slate-300 font-medium">Nonverbal / Sulit Bicara</p>
                                    <p className="text-sm font-extrabold text-white">Teks ➔ Suara Jelas</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-teal-400">Siap &gt;</span>
                        </div>

                        {/* Connector line */}
                        <div className="h-4 w-0.5 bg-gradient-to-b from-teal-500/40 via-indigo-500/40 to-slate-400/40 mx-8 my-0.5" />

                        {/* Bubble 3: Deaf STT */}
                        <div className="rounded-2xl bg-navy-800 p-3.5 border border-slate-600 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center text-white text-lg font-black shadow-md">
                                    💬
                                </span>
                                <div>
                                    <p className="text-xs text-slate-300 font-medium">Tuli / Sulit Mendengar</p>
                                    <p className="text-sm font-extrabold text-white">Suara ➔ Teks Realtime</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-300">Siap &gt;</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
