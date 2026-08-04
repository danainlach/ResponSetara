import React from 'react';
import type { RecognitionStateStatus } from './types';

interface RecognitionStatusProps {
    status: RecognitionStateStatus;
    isListening: boolean;
    errorMessage: string | null;
}

export default function RecognitionStatus({
    status,
    isListening,
    errorMessage,
}: RecognitionStatusProps) {
    const getStatusContent = () => {
        switch (status) {
            case 'idle':
                return {
                    label: 'Mikrofon belum aktif (Siaga)',
                    description: 'Tekan tombol "Mulai Mendengarkan" untuk mengaktifkan mikrofon dan mentranskripsi ucapan penolong.',
                    badgeClass: 'bg-public-surface-muted text-text-secondary border-public-border',
                    icon: '🎙️',
                };
            case 'requesting-permission':
                return {
                    label: 'Meminta izin mikrofon...',
                    description: 'Silakan klik "Izinkan / Allow" pada konfirmasi keamanan browser di layar Anda.',
                    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse',
                    icon: '⏳',
                };
            case 'listening':
                return {
                    label: 'Sedang mendengarkan (Mikrofon Aktif)',
                    description: 'Silakan penolong berbicara dengan jelas dan langsung berhadapan dengan pengguna.',
                    badgeClass: 'bg-teal-primary/10 text-teal-primary border-teal-primary/20 font-extrabold',
                    icon: '🎙️',
                };
            case 'processing':
                return {
                    label: 'Memproses ucapan penolong...',
                    description: 'Mengolah kalimat penolong ke dalam tampilan teks percakapan akhir.',
                    badgeClass: 'bg-teal-primary/10 text-teal-primary border-teal-primary/20',
                    icon: '⚙️',
                };
            case 'stopped':
                return {
                    label: 'Mendengarkan dihentikan',
                    description: 'Sesi pengenalan suara dihentikan atau terjeda. Tekan "Dengarkan Lagi" bila ingin melajutkan.',
                    badgeClass: 'bg-public-surface-muted text-text-secondary border-public-border',
                    icon: '⏹️',
                };
            case 'unsupported':
                return {
                    label: 'Browser tidak mendukung Web Speech API',
                    description: 'Peramban ini tidak dilengkapi fitur penerjemah suara bawaan. Silakan gunakan kotak input teks manual.',
                    badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    icon: '⚠️',
                };
            case 'error':
            default:
                return {
                    label: 'Terjadi kendala pada pengenalan suara',
                    description: errorMessage || 'Periksa koneksi atau mikrofon Anda, atau beralihlah ke input teks manual.',
                    badgeClass: 'bg-coral-emergency/10 text-coral-emergency border-coral-emergency/20 font-semibold',
                    icon: '❌',
                };
        }
    };

    const current = getStatusContent();

    return (
        <section aria-labelledby="status-heading" className="rounded-[22px] border border-public-border p-6 bg-card shadow-card">
            <h3 id="status-heading" className="text-xs font-extrabold uppercase tracking-wider text-text-secondary mb-2">
                Status Sensor Mikrofon
            </h3>

            {/* Polite aria-live for ordinary status announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${current.badgeClass}`}
            >
                <span aria-hidden="true" className="text-xl sm:text-2xl shrink-0">
                    {current.icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-extrabold text-text-primary flex items-center gap-2">
                        <span>{current.label}</span>
                        {isListening && (
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-teal-primary animate-ping" aria-hidden="true" />
                        )}
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary font-semibold mt-0.5 leading-relaxed">
                        {current.description}
                    </p>
                </div>
            </div>

            {/* Assertive aria-live region solely for important errors */}
            {errorMessage && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-3 p-3 rounded-xl border border-coral-emergency/20 bg-coral-emergency/10 text-coral-emergency text-xs sm:text-sm font-semibold flex items-start gap-2"
                >
                    <span aria-hidden="true">🔔</span>
                    <div>
                        <strong>Peringatan Sistem:</strong> {errorMessage}
                    </div>
                </div>
            )}
        </section>
    );
}
