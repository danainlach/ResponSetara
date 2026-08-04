import React from 'react';
import { ShieldCheck } from 'lucide-react';

const STEPS = [
    {
        number: '01',
        icon: '🎯',
        title: 'Pilih Cara Komunikasi',
        description: 'Tentukan mode kedaruratan Anda: Susun Pesan Bantuan, Teks ke Suara (Nonverbal), atau Suara ke Teks (Tuli).'
    },
    {
        number: '02',
        icon: '⌨️',
        title: 'Masukkan atau Terima Informasi',
        description: 'Pilih frasa dari kamus darurat, ketik pesan sesuai situasi krisis, atau izinkan browser membaca percakapan verbal penolong.'
    },
    {
        number: '03',
        icon: '📢',
        title: 'Tampilkan, Salin, atau Bacakan',
        description: 'Pesan disajikan dengan font besar berkontras tinggi, dibacakan lantang via speaker, atau disalin untuk panggilan cepat.'
    }
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-12 px-6 sm:px-10 rounded-3xl bg-[var(--teal-soft)]/30 border border-[var(--border)] scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                <span className="inline-block rounded-full bg-teal-primary/10 px-4 py-1 text-xs sm:text-sm font-extrabold text-teal-primary uppercase tracking-wider border border-teal-primary/20">
                    Alur Sederhana &amp; Cepat
                </span>
                <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary tracking-tight">
                    Cara Kerja ResponSetara
                </h2>
                <p className="text-base sm:text-lg text-text-secondary font-medium">
                    Tiga langkah langsung untuk memastikan informasi keadaan darurat tersampaikan dengan akurat dan inklusif di situasi genting.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
                {STEPS.map((step, index) => (
                    <div key={index} className="relative flex flex-col justify-between rounded-[22px] border border-public-border-strong bg-white p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-200">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <span aria-hidden="true" className="h-12 w-12 rounded-2xl bg-[var(--surface-soft)] border border-public-border-strong flex items-center justify-center text-2xl shadow-inner">
                                    {step.icon}
                                </span>
                                <span className="text-3xl font-black text-teal-primary">
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-text-primary mb-3 tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-semibold">
                                {step.description}
                            </p>
                        </div>
                        {/* Decorative desktop connector arrow */}
                        {index < 2 && (
                            <div aria-hidden="true" className="hidden md:flex absolute left-full top-1/2 -translate-y-1/2 z-10 w-8 items-center justify-center text-teal-primary font-bold text-xl pointer-events-none">
                                ➔
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-10 rounded-[22px] bg-white text-text-primary p-6 sm:p-8 border border-public-border-strong shadow-card text-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-extrabold">
                    <ShieldCheck aria-hidden="true" className="w-6 h-6 text-teal-primary shrink-0" />
                    <span>Tetap Bekerja Tanpa Bergantung pada AI</span>
                </div>
                <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-2xl mx-auto font-semibold leading-relaxed">
                    Jika penyempurnaan AI tidak tersedia, ResponSetara tetap menyusun pesan menggunakan template terstruktur yang aman. Fitur tertentu seperti pemuatan data dan pengenalan suara dapat bergantung pada koneksi serta dukungan browser.
                </p>
            </div>
        </section>
    );
}
