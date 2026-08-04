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
        <section aria-labelledby="hero-headline" className="landing-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#082532] to-[#0D3948] text-white p-6 sm:p-10 lg:p-12 shadow-card my-4 border border-brand-border/60">
            {/* Subtle decorative glow (accessible, pointer-events-none, aria-hidden) */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-primary/15 blur-3xl animate-float-orb" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-coral-emergency/10 blur-3xl animate-float-orb [animation-delay:4s]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[380px]">
                {/* Left Column: Headline, Description, CTA, Privacy Notice */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-primary/10 border border-teal-primary/20 text-teal-primary font-extrabold text-xs sm:text-sm tracking-wide shadow-xs">
                            <span aria-hidden="true">💡</span>
                            <span>Darurat Cepat Tanpa Batas Audio-Verbal</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0E3547] border border-brand-border text-brand-text-secondary font-bold text-xs">
                            ⚡ Tanpa Daftar &amp; Tanpa Login
                        </span>
                    </div>

                    <h1 id="hero-headline" className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-white leading-[1.15] drop-shadow-xs">
                        {headline || 'Bantu Sampaikan Keadaan Darurat Secara Inklusif'}
                    </h1>

                    <p className="text-base sm:text-lg text-[#D8E7EC] leading-relaxed font-medium max-w-xl">
                        {description || 'ResponSetara membantu pengguna yang kesulitan berbicara, mendengar, atau menyusun pesan untuk segera menyampaikan laporan bantuan darurat.'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                        <a
                            href="#modes"
                            className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-coral-emergency px-7 py-3 text-base font-extrabold text-white shadow-md hover:bg-coral-emergency/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white transition-all active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
                        >
                            <span>{primaryCta || 'Mulai Komunikasi'}</span>
                            <span aria-hidden="true" className="ml-2">➔</span>
                        </a>
                        <a
                            href="#how-it-works"
                            className="min-h-[48px] inline-flex items-center justify-center rounded-xl border-2 border-white bg-white/5 px-7 py-3 text-base font-bold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-primary transition-colors"
                        >
                            {secondaryCta || 'Cara Kerja'}
                        </a>
                    </div>

                    <div className="pt-2">
                        <div className="inline-flex items-center gap-2.5 rounded-2xl bg-[#082532]/90 py-2.5 px-4 border border-brand-border text-xs sm:text-sm text-teal-glow font-semibold shadow-inner">
                            <span aria-hidden="true" className="text-base">🔒</span>
                            <span>{privacyNotice || 'ResponSetara tidak menyimpan identitas pengguna, isi pesan, lokasi, audio, maupun transkripsi.'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Lightweight CSS Interactive Illustration (No large video/heavy media, accessible) */}
                <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                    <div aria-hidden="true" className="w-full max-w-md rounded-3xl bg-brand-background/80 border border-brand-border/60 p-6 shadow-card space-y-4 select-none pointer-events-none animate-float-card">
                        <div className="flex items-center justify-between pb-3 border-b border-brand-border/60 text-xs font-bold text-brand-text-secondary">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-teal-primary animate-pulse motion-reduce:animate-none"></span>
                                <span>Sistem Siaga Darurat</span>
                            </span>
                            <span className="rounded-md bg-teal-primary/20 px-2 py-0.5 text-[11px] text-teal-accent font-bold border border-teal-primary/30">
                                Zero Retention
                            </span>
                        </div>

                        {/* Bubble 1: Bantuan Darurat */}
                        <div className="rounded-2xl bg-brand-surface p-3.5 border border-coral-emergency/30 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-coral-emergency flex items-center justify-center text-white text-lg font-black shadow-md">
                                    🆘
                                </span>
                                <div>
                                    <p className="text-xs text-brand-text-secondary font-medium">Bantuan Cepat</p>
                                    <p className="text-sm font-extrabold text-white">Susun Pesan &amp; Broadcast</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-coral-accent">Aktif &gt;</span>
                        </div>

                        {/* Connector line */}
                        <div className="h-4 w-0.5 bg-gradient-to-b from-coral-emergency/40 via-teal-primary/40 to-teal-primary/40 mx-8 my-0.5" />

                        {/* Bubble 2: Nonverbal TTS */}
                        <div className="rounded-2xl bg-brand-surface p-3.5 border border-brand-border/60 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-teal-primary flex items-center justify-center text-white text-lg font-black shadow-md">
                                    🔊
                                </span>
                                <div>
                                    <p className="text-xs text-brand-text-secondary font-medium">Sulit Berbicara</p>
                                    <p className="text-sm font-extrabold text-white">Teks ke Suara Jelas</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-teal-accent">Aktif &gt;</span>
                        </div>

                        {/* Connector line */}
                        <div className="h-4 w-0.5 bg-gradient-to-b from-teal-primary/40 via-cyan-primary/40 to-slate-400/40 mx-8 my-0.5" />

                        {/* Bubble 3: Deaf STT */}
                        <div className="rounded-2xl bg-brand-surface p-3.5 border border-brand-border/60 flex items-center justify-between text-left shadow-sm">
                            <div className="flex items-center space-x-3">
                                <span className="h-10 w-10 rounded-xl bg-brand-surface-elevated flex items-center justify-center text-white text-lg font-black shadow-md">
                                    💬
                                </span>
                                <div>
                                    <p className="text-xs text-brand-text-secondary font-medium">Sulit Mendengar</p>
                                    <p className="text-sm font-extrabold text-white">Suara ke Teks Instan</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-brand-text-secondary">Aktif &gt;</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
