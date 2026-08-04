import React from 'react';
import ResponSetaraLogo from '../../branding/ResponSetaraLogo';

export default function LandingFooter() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-sm text-brand-text">
            <div className="space-y-3">
                <ResponSetaraLogo markSize={32} showDescriptor={true} darkTheme={true} />
                <p className="text-xs sm:text-sm text-brand-text-secondary font-medium max-w-md leading-relaxed">
                    Membantu penyandang disabilitas (Tuli &amp; Nonverbal) serta masyarakat umum menyampaikan informasi kedaruratan dengan cepat, aman, dan mandiri.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 text-xs sm:text-sm text-brand-text-secondary">
                <div className="space-y-1">
                    <p className="font-bold">&copy; 2026 ResponSetara. Mematuhi Prinsip Kesetaraan Akses &amp; WCAG AA.</p>
                    <p className="text-teal-accent font-semibold flex items-center gap-1.5">
                        <span aria-hidden="true">🔒</span>
                        <span>Beroperasi aman dengan kebijakan Zero-Data Retention.</span>
                    </p>
                </div>
                
                <div className="flex flex-col gap-2 border-t border-brand-border pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6 shrink-0">
                    <a 
                        href="/login" 
                        className="font-extrabold text-teal-accent hover:text-teal-glow hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary py-1 rounded"
                    >
                        Portal Admin ➔
                    </a>
                </div>
            </div>
        </div>
    );
}
