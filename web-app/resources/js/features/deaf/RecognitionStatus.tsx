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
                    badgeClass: 'bg-slate-100 text-ink-900 border-slate-300',
                    icon: '🎙️',
                };
            case 'requesting-permission':
                return {
                    label: 'Meminta izin mikrofon...',
                    description: 'Silakan klik "Izinkan / Allow" pada konfirmasi keamanan browser di layar Anda.',
                    badgeClass: 'bg-amber-50 text-amber-900 border-amber-400 animate-pulse',
                    icon: '⏳',
                };
            case 'listening':
                return {
                    label: 'Sedang mendengarkan (Mikrofon Aktif)',
                    description: 'Silakan penolong berbicara dengan jelas dan langsung berhadapan dengan pengguna.',
                    badgeClass: 'bg-teal-50 text-teal-900 border-teal-600 font-extrabold',
                    icon: '🟢',
                };
            case 'processing':
                return {
                    label: 'Memproses ucapan penolong...',
                    description: 'Mengolah kalimat penolong ke dalam tampilan teks percakapan akhir.',
                    badgeClass: 'bg-blue-50 text-blue-900 border-blue-400',
                    icon: '⚙️',
                };
            case 'stopped':
                return {
                    label: 'Mendengarkan dihentikan',
                    description: 'Sesi pengenalan suara dihentikan atau terjeda. Tekan "Dengarkan Lagi" bila ingin melajutkan.',
                    badgeClass: 'bg-slate-100 text-slate-800 border-slate-400',
                    icon: '⏹️',
                };
            case 'unsupported':
                return {
                    label: 'Browser tidak mendukung Web Speech API',
                    description: 'Peramban ini tidak dilengkapi fitur penerjemah suara bawaan. Silakan gunakan kotak input teks manual.',
                    badgeClass: 'bg-amber-100 text-amber-900 border-amber-500',
                    icon: '⚠️',
                };
            case 'error':
            default:
                return {
                    label: 'Terjadi kendala pada pengenalan suara',
                    description: errorMessage || 'Periksa koneksi atau mikrofon Anda, atau beralihlah ke input teks manual.',
                    badgeClass: 'bg-coral-50 text-coral-900 border-coral-600 font-semibold',
                    icon: '❌',
                };
        }
    };

    const current = getStatusContent();

    return (
        <section aria-labelledby="status-heading" className="rounded-2xl border-2 border-slate-200 p-4 sm:p-5 bg-white shadow-xs">
            <h3 id="status-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Status Sensor Mikrofon
            </h3>

            {/* Polite aria-live for ordinary status announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-colors ${current.badgeClass}`}
            >
                <span aria-hidden="true" className="text-xl sm:text-2xl shrink-0">
                    {current.icon}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-extrabold text-navy-900 flex items-center gap-2">
                        <span>{current.label}</span>
                        {isListening && (
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-teal-600 animate-ping" aria-hidden="true" />
                        )}
                    </p>
                    <p className="text-xs sm:text-sm text-ink-600 font-medium mt-0.5 leading-relaxed">
                        {current.description}
                    </p>
                </div>
            </div>

            {/* Assertive aria-live region solely for important errors */}
            {errorMessage && (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-3 p-3 rounded-xl border border-coral-600 bg-coral-50 text-coral-900 text-xs sm:text-sm font-semibold flex items-start gap-2"
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
