import React from 'react';
import type { VoiceOption } from './types';

interface VoiceSelectorProps {
    voices: VoiceOption[];
    selectedVoice: VoiceOption | null;
    hasIndonesianVoice: boolean;
    isSupported: boolean;
    onSelectVoice: (uri: string) => void;
}

export default function VoiceSelector({
    voices,
    selectedVoice,
    hasIndonesianVoice,
    isSupported,
    onSelectVoice,
}: VoiceSelectorProps) {
    if (!isSupported || voices.length === 0) {
        return (
            <div className="rounded-xl border border-public-border bg-public-surface-muted p-3.5 text-sm text-text-secondary font-semibold">
                Pilihan suara tidak tersedia atau sedang dimuat oleh sistem browser.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label htmlFor="voice-selector" className="block text-sm sm:text-base font-extrabold text-text-primary">
                Pilih Suara Pembacakan (Voice)
            </label>

            {!hasIndonesianVoice && (
                <div role="alert" className="rounded-xl border border-amber-350 bg-amber-50 p-3 text-xs sm:text-sm text-amber-850 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Suara Bahasa Indonesia tidak tersedia di perangkat Anda. Membacakan menggunakan suara default browser.</span>
                </div>
            )}

            <select
                id="voice-selector"
                value={selectedVoice?.uri || ''}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-public-border bg-[var(--surface)] px-4 py-2.5 text-sm sm:text-base text-text-primary font-bold focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] transition-all cursor-pointer"
            >
                {voices.map((voice) => (
                    <option key={voice.uri} value={voice.uri}>
                        {voice.name} ({voice.lang}) {voice.isIndonesian ? '── [Prioritas Indonesia]' : voice.isDefault ? '── [Default]' : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}
