import React from 'react';
import type { GeoStatus } from './types';

interface LocationFieldProps {
    manualText: string;
    onManualTextChange: (text: string) => void;
    onSearchGeo: () => void;
    geoStatus: GeoStatus;
    latitude: number | null;
    longitude: number | null;
    includeCoordinates: boolean;
    error?: string[];
}

export default function LocationField({
    manualText,
    onManualTextChange,
    onSearchGeo,
    geoStatus,
    latitude,
    longitude,
    includeCoordinates,
    error
}: LocationFieldProps) {
    return (
        <fieldset aria-invalid={!!error} aria-describedby={error ? "location-error-desc" : undefined} className="space-y-4 pt-4">
            <legend className="text-lg sm:text-xl font-extrabold text-navy-900 pb-1 border-b border-slate-200 w-full">
                4. Lokasi Kejadian Darurat
            </legend>

            {error && (
                <p id="location-error-desc" role="alert" className="text-sm font-bold text-coral-600 bg-coral-50 p-3 rounded-lg border border-coral-600/30">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            <div className="bg-slate-200/50 p-4 sm:p-5 rounded-2xl border border-slate-300 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-navy-900">
                            Ambil Koordinat GPS (Opsional &amp; Aman Privasi)
                        </p>
                        <p className="text-xs text-ink-600 mt-0.5">
                            Koordinat GPS diolah mandiri tanpa pencetakan log atau retensi server.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onSearchGeo}
                        disabled={geoStatus === 'locating'}
                        className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl bg-navy-900 px-5 py-2.5 text-sm sm:text-base font-bold text-white shadow-xs hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:opacity-50 transition-colors"
                    >
                        {geoStatus === 'locating' ? (
                            <span className="flex items-center">
                                <span className="animate-spin mr-2">⏳</span>
                                <span>Sedang Mengambil...</span>
                            </span>
                        ) : (
                            <span>📍 Gunakan Lokasi Perangkat</span>
                        )}
                    </button>
                </div>

                {/* Status indicator for geolocation */}
                {geoStatus === 'success' && includeCoordinates && (
                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-700/40 text-sm font-semibold text-teal-800 flex items-center justify-between" role="status" aria-live="polite">
                        <span>✔ Koordinat GPS Terdeteksi: {latitude?.toFixed(5)}, {longitude?.toFixed(5)}</span>
                    </div>
                )}
                {geoStatus === 'denied' && (
                    <div className="p-3 rounded-xl bg-coral-50 border border-coral-600/30 text-xs sm:text-sm font-semibold text-coral-700" role="alert" aria-live="assertive">
                        ⚠️ Izin lokasi ditolak atau terabaikan. Silakan ketik alamat manual di kotak bawah.
                    </div>
                )}
                {(geoStatus === 'error' || geoStatus === 'unsupported') && (
                    <div className="p-3 rounded-xl bg-slate-200 border border-slate-300 text-xs sm:text-sm text-ink-600 font-semibold" role="alert">
                        ℹ️ Geolokasi tidak tersedia di peramban ini. Silakan gunakan kotak alamat manual di bawah.
                    </div>
                )}

                <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                        <label htmlFor="manual-location-input" className="text-sm font-bold text-navy-900">
                            Ketik Lokasi Manual (Patokan / Nama Jalan)
                        </label>
                        <span className="text-xs font-semibold text-ink-600">
                            {manualText.length} / 180
                        </span>
                    </div>
                    <input
                        id="manual-location-input"
                        type="text"
                        maxLength={180}
                        value={manualText}
                        onChange={(e) => onManualTextChange(e.target.value)}
                        placeholder="Contoh: Jl. Gatot Subroto No. 45, depan Gerbang Timur"
                        className="w-full min-h-[48px] rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-base text-ink-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-colors"
                    />
                </div>
            </div>
        </fieldset>
    );
}
