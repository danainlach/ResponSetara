import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import SkipLink from '../components/accessibility/SkipLink';
import LiveAnnouncer from '../components/accessibility/LiveAnnouncer';
import LandingNavbar from '../components/public/landing/LandingNavbar';
import LandingFooter from '../components/public/landing/LandingFooter';

interface PublicLayoutProps {
    children: ReactNode;
    announcement?: string | null;
}

export default function PublicLayout({ children, announcement = null }: PublicLayoutProps) {
    const [isLargeText, setIsLargeText] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('responsetara_text_size') === 'large';
        }

        return false;
    });

    const [toggleAnnouncement, setToggleAnnouncement] = useState<string | null>(null);

    useEffect(() => {
        document.documentElement.dataset.textSize = isLargeText ? 'large' : 'normal';
        localStorage.setItem('responsetara_text_size', isLargeText ? 'large' : 'normal');

        return () => {
            delete document.documentElement.dataset.textSize;
        };
    }, [isLargeText]);

    const toggleTextSize = () => {
        setIsLargeText(prev => {
            const next = !prev;
            setToggleAnnouncement(next ? "Ukuran teks diperbesar." : "Ukuran teks dikembalikan ke normal.");

            return next;
        });
    };

    return (
        <div className="public-shell min-h-screen bg-page-bg text-text-primary flex flex-col font-sans antialiased selection:bg-teal-primary/20 text-base leading-relaxed transition-colors duration-200">
            <SkipLink />
            <LiveAnnouncer message={toggleAnnouncement || announcement} ariaLive="polite" />
            
            <header className="sticky top-0 z-40 bg-brand-bg backdrop-blur-md text-brand-text shadow-md border-b border-brand-border/60 transition-shadow">
                <LandingNavbar 
                    isLargeText={isLargeText} 
                    onToggleTextSize={toggleTextSize}
                />
            </header>

            <main id="main-content" tabIndex={-1} className="public-page flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 outline-none space-y-12 sm:space-y-16">
                {children}
            </main>

            <footer className="bg-brand-bg text-brand-text-secondary border-t border-brand-border/60 mt-16 shadow-inner">
                <LandingFooter />
            </footer>
        </div>
    );
}
