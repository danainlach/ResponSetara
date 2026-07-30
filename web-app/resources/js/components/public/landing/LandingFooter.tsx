import React from 'react';

export default function LandingFooter() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-200">
            <div className="text-center md:text-left space-y-1">
                <p className="font-extrabold tracking-tight text-white text-base">
                    Respon<span className="text-teal-400">Setara</span> &mdash; Komunikasi Darurat Inklusif
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md">
                    Membantu penyandang disabilitas (Tuli &amp; Nonverbal) serta masyarakat umum menyampaikan informasi kedaruratan dengan cepat dan mandiri.
                </p>
            </div>
            <div className="text-center md:text-right text-xs sm:text-sm text-slate-300 space-y-1">
                <p className="font-bold">&copy; 2026 ResponSetara. Mematuhi Prinsip Kesetaraan Akses &amp; WCAG AA.</p>
                <p className="text-teal-300 font-semibold">🔒 Beroperasi aman dengan kebijakan Zero-Data Retention.</p>
            </div>
        </div>
    );
}
