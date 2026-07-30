import React, { useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import HeroSection from '../../components/public/landing/HeroSection';
import CommunicationModesSection from '../../components/public/landing/CommunicationModesSection';
import HowItWorksSection from '../../components/public/landing/HowItWorksSection';
import HelperGuidesSection from '../../components/public/landing/HelperGuidesSection';
import EmergencyContactsSection from '../../components/public/landing/EmergencyContactsSection';
import PrivacyDisclaimerSection from '../../components/public/landing/PrivacyDisclaimerSection';
import StateError from '../../components/feedback/StateError';
import type { LandingPageProps } from '../../types/public-api';

export default function Home({ 
    configs = [], 
    helperGuides = [], 
    emergencyContacts = [], 
    hasError = false 
}: LandingPageProps) {
    
    const handleGlobalRetry = useCallback(() => {
        router.reload({ only: ['configs', 'categories', 'helperGuides', 'emergencyContacts', 'hasError'] });
    }, []);

    return (
        <PublicLayout announcement={hasError ? "Terjadi kendala memuat sebagian informasi online. Konten cadangan aman diaktifkan." : null}>
            <Head>
                <title>ResponSetara &mdash; Komunikasi Darurat Inklusif Indonesia</title>
                <meta 
                    name="description" 
                    content="Platform interaksi dan komunikasi darurat inklusif yang mudah dipahami semua orang, termasuk pengguna Tuli dan Nonverbal di Indonesia." 
                />
            </Head>

            {hasError && (
                <div className="mb-6">
                    <StateError 
                        message="Terjadi kendala saat memuat pemutakhiran data secara real-time dari server. Aplikasi tetap berfungsi menggunakan data cadangan terjamin (Fallback Safe Mode)." 
                        onRetry={handleGlobalRetry} 
                    />
                </div>
            )}

            {/* 1. Hero Section & Primary CTAs */}
            <HeroSection configs={configs} />

            {/* 2. Three Communication Mode Selectors (UI Shell) */}
            <CommunicationModesSection />

            {/* 3. How It Works (Template Fallback Assurance) */}
            <HowItWorksSection />

            {/* 4. Helper Guides (From Public API v1 / Props) */}
            <HelperGuidesSection 
                initialGuides={helperGuides} 
                hasError={hasError && helperGuides.length === 0} 
                onRetry={handleGlobalRetry} 
            />

            {/* 5. Official Verified Emergency Contacts */}
            <EmergencyContactsSection 
                contacts={emergencyContacts} 
                hasError={hasError} 
                onRetry={handleGlobalRetry} 
            />

            {/* 6. Mandatory Privacy Transparency & Legal Disclaimer */}
            <PrivacyDisclaimerSection />
        </PublicLayout>
    );
}
