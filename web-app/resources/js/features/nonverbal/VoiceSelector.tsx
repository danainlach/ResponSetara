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
            <div className="rounded-xl border border-slate-300 bg-slate-100 p-3.5 text-sm text-ink-600 font-medium">
                Pilihan suara tidak tersedia atau sedang dimuat oleh sistem browser.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label htmlFor="voice-selector" className="block text-sm sm:text-base font-bold text-navy-900">
                Pilih Suara Pembacakan (Voice)
            </label>

            {!hasIndonesianVoice && (
                <div role="alert" className="rounded-xl border border-amber-500 bg-amber-50 p-3 text-xs sm:text-sm text-amber-900 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Suara Bahasa Indonesia tidak tersedia di perangkat Anda. Membacakan menggunakan suara default browser.</span>
                </div>
            )}

            <select
                id="voice-selector"
                value={selectedVoice?.uri || ''}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm sm:text-base text-ink-900 font-semibold focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-colors cursor-pointer"
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
