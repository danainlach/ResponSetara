import React from 'react';

interface BrowserCompatibilityNoticeProps {
    isSupported: boolean;
}

export default function BrowserCompatibilityNotice({ isSupported }: BrowserCompatibilityNoticeProps) {
    return (
        <section aria-labelledby="privacy-compatibility-heading" className="space-y-3 mb-6">
            <h2 id="privacy-compatibility-heading" className="sr-only">
                Jaminan Privasi dan Kompatibilitas Peramban
            </h2>

            {/* Absolute Privacy & Zero Data Retention Notice */}
            <div className="rounded-2xl border-2 border-teal-700/30 bg-teal-50/70 p-4 sm:p-5 text-navy-900 shadow-xs">
                <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-2xl mt-0.5 shrink-0">🔒</span>
                    <div className="space-y-1.5 min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-teal-950">
                            ResponSetara tidak menyimpan audio atau transkripsi.
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-700 font-medium leading-relaxed">
                            Pemrosesan pengenalan suara dapat mengikuti layanan dan kebijakan browser yang digunakan.
                            Seluruh ucapan dan kalimat langsung dihapuskan secara instan begitu Anda meninggalkan laman darurat ini.
                        </p>
                    </div>
                </div>
            </div>

            {/* Browser Compatibility Alert when Web Speech API is unsupported */}
            {!isSupported && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-amber-950 flex items-start gap-3 shadow-xs"
                >
                    <span aria-hidden="true" className="text-xl shrink-0 mt-0.5">⚠️</span>
                    <div>
                        <h4 className="text-sm sm:text-base font-extrabold">
                            Fitur Pengenalan Suara (Speech-to-Text) Tidak Tersedia di Browser Ini
                        </h4>
                        <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                            Peramban yang Anda gunakan saat ini tidak mendukung antarmuka Web Speech API (SpeechRecognition).
                            Namun Anda tetap dapat menggunakan <strong>Input Teks Manual</strong> di bawah untuk menyampaikan kalimat kepada pengguna darurat.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}
