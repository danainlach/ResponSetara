import React, { useState, useRef, useEffect } from 'react';
import TextSizeToggle from '../../accessibility/TextSizeToggle';

interface LandingNavbarProps {
    isLargeText: boolean;
    onToggleTextSize: () => void;
}

export default function LandingNavbar({ isLargeText, onToggleTextSize }: LandingNavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => {
            const next = !prev;

            if (!next && toggleButtonRef.current) {
                setTimeout(() => toggleButtonRef.current?.focus(), 50);
            }

            return next;
        });
    };

    const closeMenuAndScroll = () => {
        setIsMobileMenuOpen(false);

        if (toggleButtonRef.current) {
            setTimeout(() => toggleButtonRef.current?.focus(), 50);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMenuAndScroll();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    return (
        <nav aria-label="Navigasi Utama ResponSetara" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                <a 
                    href="/" 
                    aria-label="Kembali ke beranda ResponSetara"
                    className="flex items-center space-x-2 rounded-xl py-1.5 px-2 text-white hover:text-teal-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors"
                >
                    <span className="font-black tracking-tight text-xl text-white">Respon<span className="text-teal-400">Setara</span></span>
                </a>
            </div>

            <div className="hidden lg:flex items-center justify-end gap-1 xl:gap-3 flex-wrap">
                <a href="#modes" className="text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors">
                    Mode Komunikasi
                </a>
                <a href="#how-it-works" className="text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors">
                    Cara Kerja
                </a>
                <a href="#helper-guides" className="text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors">
                    Panduan
                </a>
                <a href="#emergency-contacts" className="text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors">
                    Kontak Darurat
                </a>
                <a href="#privacy" className="text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 transition-colors">
                    Privasi
                </a>
                
                <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-navy-800">
                    <TextSizeToggle isLargeText={isLargeText} onToggle={onToggleTextSize} />
                    <a
                        href="#modes"
                        className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-coral-600 px-4 py-2 text-sm font-extrabold text-white shadow-xs hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white transition-colors shrink-0"
                    >
                        Mulai
                    </a>
                </div>
            </div>

            <div className="flex items-center space-x-2 lg:hidden">
                <TextSizeToggle isLargeText={isLargeText} onToggle={onToggleTextSize} />
                <button
                    ref={toggleButtonRef}
                    type="button"
                    onClick={toggleMobileMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-nav-menu"
                    aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi utama"}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-navy-800 border border-navy-700/80 p-2.5 text-white hover:bg-navy-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <span aria-hidden="true" className="text-xl font-bold">✕</span>
                    ) : (
                        <span aria-hidden="true" className="text-xl font-bold">☰</span>
                    )}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div id="mobile-nav-menu" className="absolute top-full left-0 z-50 w-full bg-navy-900 border-b border-navy-800 shadow-2xl p-4 lg:hidden flex flex-col space-y-2.5">
                    <a 
                        href="#modes" 
                        onClick={closeMenuAndScroll}
                        className="min-h-[44px] flex items-center px-4 rounded-xl text-base font-bold text-white bg-navy-800/60 hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
                    >
                        Mode Komunikasi
                    </a>
                    <a 
                        href="#how-it-works" 
                        onClick={closeMenuAndScroll}
                        className="min-h-[44px] flex items-center px-4 rounded-xl text-base font-bold text-white bg-navy-800/60 hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
                    >
                        Cara Kerja
                    </a>
                    <a 
                        href="#helper-guides" 
                        onClick={closeMenuAndScroll}
                        className="min-h-[44px] flex items-center px-4 rounded-xl text-base font-bold text-white bg-navy-800/60 hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
                    >
                        Panduan Penolong
                    </a>
                    <a 
                        href="#emergency-contacts" 
                        onClick={closeMenuAndScroll}
                        className="min-h-[44px] flex items-center px-4 rounded-xl text-base font-bold text-white bg-navy-800/60 hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
                    >
                        Kontak Darurat
                    </a>
                    <a 
                        href="#privacy" 
                        onClick={closeMenuAndScroll}
                        className="min-h-[44px] flex items-center px-4 rounded-xl text-base font-bold text-white bg-navy-800/60 hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
                    >
                        Privasi &amp; Disclaimer
                    </a>
                    <div className="pt-2 border-t border-navy-800">
                        <a 
                            href="#modes" 
                            onClick={closeMenuAndScroll}
                            className="min-h-[48px] w-full inline-flex items-center justify-center rounded-xl bg-coral-600 px-4 py-2.5 text-base font-extrabold text-white shadow-md hover:bg-coral-600/90"
                        >
                            Mulai Komunikasi ➔
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
