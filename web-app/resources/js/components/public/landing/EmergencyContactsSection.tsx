import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { EmergencyContact } from '../../../types/public-api';
import { FALLBACK_CONTACTS } from '../../../constants/fallback-config';
import StateError from '../../feedback/StateError';

interface EmergencyContactsSectionProps {
    contacts: EmergencyContact[];
    hasError?: boolean;
    onRetry?: () => void;
}

function getServiceIcon(number: string): string {
    switch (number) {
        case '119': return '🚑';
        case '112': return '🚨';
        case '110': return '🚓';
        case '113': return '🚒';
        default: return '📞';
    }
}

function formatScopeBadge(scope: string, number: string): string {
    if (number === '112' || scope.toLowerCase().includes('bergantung') || scope.toLowerCase().includes('terpilih')) {
        return 'Bergantung Wilayah';
    }

    if (scope.toLowerCase().includes('daerah') || scope.toLowerCase().includes('lokal')) {
        return 'Layanan Daerah';
    }

    return 'Nasional';
}

export default function EmergencyContactsSection({ 
    contacts = [], 
    hasError = false,
    onRetry 
}: EmergencyContactsSectionProps) {
    const [confirmContact, setConfirmContact] = useState<EmergencyContact | null>(null);
    const displayContacts = contacts.length > 0 ? contacts : (hasError || contacts.length === 0 ? FALLBACK_CONTACTS : []);
    
    const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const modalRef = useRef<HTMLDivElement>(null);
    const telLinkRef = useRef<HTMLAnchorElement>(null);

    const handlePrepareCall = (contact: EmergencyContact) => {
        setConfirmContact(contact);
    };

    const handleCloseModal = useCallback(() => {
        const targetNumber = confirmContact?.number;
        setConfirmContact(null);

        if (targetNumber && triggerRefs.current[targetNumber]) {
            setTimeout(() => {
                triggerRefs.current[targetNumber]?.focus();
            }, 50);
        }
    }, [confirmContact]);

    useEffect(() => {
        if (!confirmContact) {
            return;
        }

        setTimeout(() => {
            telLinkRef.current?.focus();
        }, 50);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCloseModal();
            }

            if (e.key === 'Tab') {
                const focusables = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');

                if (focusables && focusables.length > 0) {
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];

                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [confirmContact, handleCloseModal]);

    return (
        <section id="emergency-contacts" aria-labelledby="emergency-contacts-heading" className="py-10 border-t border-border-subtle scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <span className="inline-block rounded-full bg-red-50 px-4 py-1 text-xs sm:text-sm font-extrabold text-red-800 uppercase tracking-wider border border-red-200">
                    Siaga 24 Jam Bebas Pulsa
                </span>
                <h2 id="emergency-contacts-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">
                    Kontak Darurat Resmi
                </h2>
                <p className="text-base sm:text-lg text-ink-600 font-medium">
                    Daftar nomor layanan panggilan kedaruratan nasional bebas pulsa terverifikasi di Indonesia. Tekan tombol siapkan untuk memanggil.
                </p>
            </div>

            {hasError && contacts.length === 0 && (
                <div className="mb-6">
                    <StateError message="Terjadi kendala saat memuat pemutakhiran kontak darurat dari server." onRetry={onRetry} />
                    <p className="text-center text-sm font-semibold text-coral-600 mt-2">
                        Mengaktifkan tampilan daftar kontak default terjamin (Fallback Mode).
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                {displayContacts.map((contact) => {
                    const scopeText = formatScopeBadge(contact.scope || 'Nasional', contact.number);
                    const statusText = contact.last_verified_at || contact.source_name ? 'Sumber Terverifikasi' : 'Perlu Verifikasi';
                    const icon = getServiceIcon(contact.number);
                    const coverageNote = contact.number === '112' 
                        ? 'Penerapan dan integrasi layanan 112 dapat berbeda menurut pemerintah daerah.'
                        : (contact.coverage_note || 'Layanan darurat terpadu 24 jam.');

                    return (
                        <div
                            key={contact.id ?? contact.number}
                            className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <span aria-hidden="true" className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-600/20 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                                        {icon}
                                    </span>
                                    <div className="flex flex-col items-end gap-1.5 text-right">
                                        <span className="inline-block rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-black text-navy-900 uppercase tracking-wider">
                                            {scopeText}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-600/30">
                                            ✓ {statusText}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 tracking-tight leading-snug">
                                        {contact.service_name}
                                    </h3>
                                    <p className="text-3xl sm:text-4xl font-black text-coral-600 my-2 tracking-wider">
                                        {contact.number}
                                    </p>
                                </div>

                                <p className="text-sm text-ink-600 font-semibold leading-relaxed line-clamp-4">
                                    {coverageNote}
                                </p>

                                <div className="pt-2 border-t border-slate-100 text-xs font-bold text-ink-600 space-y-1">
                                    <p>
                                        <span className="text-slate-500 font-normal">Cakupan: </span>
                                        {scopeText}
                                    </p>
                                    <p>
                                        <span className="text-slate-500 font-normal">Terakhir diverifikasi: </span>
                                        {contact.last_verified_at ? contact.last_verified_at : 'Juli 2026 (Teratur)'}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 mt-auto">
                                <button
                                    ref={(el) => {
 triggerRefs.current[contact.number] = el; 
}}
                                    type="button"
                                    onClick={() => handlePrepareCall(contact)}
                                    aria-label={`Siapkan panggilan darurat ke ${contact.service_name} di nomor ${contact.number}`}
                                    className="w-full min-h-[48px] inline-flex items-center justify-center rounded-2xl bg-navy-900 px-4 py-3 text-sm sm:text-base font-bold text-white shadow-xs hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
                                >
                                    Siapkan Panggilan ➔
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 rounded-3xl bg-teal-50 p-6 border border-teal-700/30 text-center max-w-4xl mx-auto shadow-xs">
                <p className="text-base font-extrabold text-navy-900">
                    ℹ️ Catatan Penting Cakupan Wilayah &amp; Alternatif
                </p>
                <p className="mt-1.5 text-sm sm:text-base text-ink-600 font-medium leading-relaxed max-w-3xl mx-auto">
                    Cakupan layanan darurat terpadu <strong>112</strong> dapat berbeda dan belum tersambung merata di seluruh pelosok daerah Indonesia. Apabila mengalami kendala sambungan, segera hubungi nomor layanan darurat instansi spesifik lokal terdekat (Medis 119, Polisi 110, atau Pemadam 113).
                </p>
            </div>

            {/* Shared Confirmation Modal (No inline expanding cards) */}
            {confirmContact && (
                <div 
                    ref={modalRef}
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="confirm-call-title"
                    aria-describedby="confirm-call-desc"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in motion-reduce:animate-none"
                >
                    <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 text-center">
                        <div className="mx-auto h-16 w-16 rounded-3xl bg-coral-50 border border-coral-600/30 flex items-center justify-center text-3xl shadow-xs">
                            {getServiceIcon(confirmContact.number)}
                        </div>

                        <div className="space-y-2">
                            <h3 id="confirm-call-title" className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                                Hubungi {confirmContact.service_name}?
                            </h3>
                            <p className="text-4xl font-black text-coral-600 tracking-wider">
                                {confirmContact.number}
                            </p>
                        </div>

                        <p id="confirm-call-desc" className="text-sm sm:text-base text-ink-600 font-semibold leading-relaxed px-2">
                            Pastikan nomor dan cakupan layanan sesuai dengan wilayah Anda. Tekan tombol di bawah untuk menyambungkan panggilan melalui telepon Anda.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
                            <a
                                ref={telLinkRef}
                                href={`tel:${confirmContact.number}`}
                                onClick={() => {
                                    // Let tel: execute, then modal can remain or user closes
                                }}
                                className="flex-1 min-h-[48px] inline-flex items-center justify-center rounded-2xl bg-coral-600 px-6 py-3.5 text-base font-extrabold text-white shadow-md hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-600/50 transition-all active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
                            >
                                📞 Hubungi {confirmContact.number}
                            </a>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                aria-label="Batal menelepon dan kembali ke daftar kontak"
                                className="min-h-[48px] inline-flex items-center justify-center rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 text-sm sm:text-base font-bold text-ink-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
