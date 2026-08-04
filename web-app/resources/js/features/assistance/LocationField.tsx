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
            <legend className="text-lg sm:text-xl font-extrabold text-text-primary pb-1 border-b border-public-border w-full">
                4. Lokasi Kejadian Darurat
            </legend>

            {error && (
                <p id="location-error-desc" role="alert" className="text-sm font-bold text-coral-emergency bg-coral-emergency/10 p-3.5 rounded-xl border border-coral-emergency/20">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            <div className="bg-public-surface-muted p-5 rounded-2xl border border-public-border space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-extrabold text-text-primary">
                            Ambil Koordinat GPS (Opsional &amp; Aman Privasi)
                        </p>
                        <p className="text-xs text-text-secondary font-semibold mt-0.5">
                            Koordinat GPS diolah mandiri tanpa pencetakan log atau retensi server.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onSearchGeo}
                        disabled={geoStatus === 'locating'}
                        className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl bg-teal-primary px-5 py-2.5 text-sm sm:text-base font-extrabold text-white shadow-xs hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 disabled:opacity-100 disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
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
                    <div className="p-3 rounded-xl bg-teal-primary/10 border border-teal-primary/20 text-sm font-extrabold text-teal-primary flex items-center justify-between" role="status" aria-live="polite">
                        <span>✔ Koordinat GPS Terdeteksi: {latitude?.toFixed(5)}, {longitude?.toFixed(5)}</span>
                    </div>
                )}
                {geoStatus === 'denied' && (
                    <div className="p-3 rounded-xl bg-coral-emergency/10 border border-coral-emergency/20 text-xs sm:text-sm font-extrabold text-coral-emergency" role="alert" aria-live="assertive">
                        ⚠️ Izin lokasi ditolak atau terabaikan. Silakan ketik alamat manual di kotak bawah.
                    </div>
                )}
                {(geoStatus === 'error' || geoStatus === 'unsupported') && (
                    <div className="p-3 rounded-xl bg-public-surface-muted border border-public-border text-xs sm:text-sm text-text-secondary font-semibold" role="alert">
                        ℹ️ Geolokasi tidak tersedia di peramban ini. Silakan gunakan kotak alamat manual di bawah.
                    </div>
                )}

                <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                        <label htmlFor="manual-location-input" className="text-sm font-extrabold text-text-primary">
                            Ketik Lokasi Manual (Patokan / Nama Jalan)
                        </label>
                        <span className="text-xs font-extrabold text-text-secondary">
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
                        className="w-full min-h-[48px] rounded-xl border border-public-border bg-[var(--surface)] px-4 py-2.5 text-base text-text-primary placeholder:text-public-text-muted font-bold focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] transition-all"
                    />
                </div>
            </div>
        </fieldset>
    );
}
