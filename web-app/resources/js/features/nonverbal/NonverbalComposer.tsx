import React from 'react';
import type { TTSState, SpeechRate } from './types';
import SpeechControls from './SpeechControls';
import VoiceSelector from './VoiceSelector';
import SpeechRateSelector from './SpeechRateSelector';
import MessageActions from './MessageActions';

interface NonverbalComposerProps {
    text: string;
    characterCount: number;
    maxLimit: number;
    isTextEmptyOrWhitespace: boolean;
    isCopying: boolean;
    copyFeedback: string | null;
    ttsState: TTSState;
    onTextChange: (text: string) => void;
    onClearText: () => void;
    onCopyText: () => void;
    onSpeak: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onRepeat: () => void;
    onSelectVoice: (uri: string) => void;
    onSelectRate: (rate: SpeechRate) => void;
}

export default function NonverbalComposer({
    text,
    characterCount,
    maxLimit,
    isTextEmptyOrWhitespace,
    isCopying,
    copyFeedback,
    ttsState,
    onTextChange,
    onClearText,
    onCopyText,
    onSpeak,
    onPause,
    onResume,
    onStop,
    onRepeat,
    onSelectVoice,
    onSelectRate,
}: NonverbalComposerProps) {
    const isOverLimit = characterCount >= maxLimit;

    return (
        <div className="space-y-6">
            {/* Strict Privacy Banner */}
            <div role="region" aria-label="Informasi Privasi Penggunaan" className="rounded-2xl border-2 border-teal-700 bg-teal-50 p-4 sm:p-5 shadow-xs flex items-start gap-3">
                <span className="text-xl sm:text-2xl mt-0.5" aria-hidden="true">🔒</span>
                <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                        Jaminan Privasi Mutlak
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600 font-medium leading-relaxed mt-0.5">
                        ResponSetara tidak menyimpan pesan atau audio. Pemrosesan suara dapat mengikuti layanan yang digunakan oleh browser Anda.
                    </p>
                </div>
            </div>

            {/* Textarea Input Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nonverbal-textarea" className="text-base sm:text-lg font-extrabold text-navy-900">
                        Teks Pesan Anda (Ketik atau Pilih Frasa)
                    </label>
                    <span 
                        id="char-counter"
                        role="status" 
                        aria-live="polite"
                        className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${
                            isOverLimit ? 'bg-rose-100 text-rose-800 border-rose-400' : 'bg-slate-100 text-ink-600 border-slate-300'
                        }`}
                    >
                        {characterCount} / {maxLimit} karakter
                    </span>
                </div>

                <textarea
                    id="nonverbal-textarea"
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    maxLength={maxLimit}
                    rows={5}
                    aria-describedby="char-counter privacy-note"
                    placeholder="Ketik pesan yang ingin disampaikan atau pilih referensi frasa cepat di samping/bawah..."
                    className="w-full rounded-2xl border-2 border-navy-800 bg-white p-4 sm:p-5 text-base sm:text-lg font-bold text-ink-900 leading-relaxed placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-colors resize-y min-h-[140px]"
                />

                {isOverLimit && (
                    <p role="alert" className="text-xs sm:text-sm text-rose-700 font-extrabold">
                        ⚠️ Anda telah mencapai batas maksimal {maxLimit} karakter.
                    </p>
                )}
                <p id="privacy-note" className="text-xs text-slate-600 font-medium italic">
                    *Teks di atas diproses di dalam memori sementara peramban dan tidak disimpan pada penyimpanan permanen ataupun server kami.
                </p>
            </div>

            {/* Speech Controls */}
            <SpeechControls
                status={ttsState.status}
                isSupported={ttsState.isSupported}
                isTextEmpty={isTextEmptyOrWhitespace}
                errorMessage={ttsState.errorMessage}
                onSpeak={onSpeak}
                onPause={onPause}
                onResume={onResume}
                onStop={onStop}
                onRepeat={onRepeat}
            />

            {/* Voice & Speed Settings */}
            {ttsState.isSupported && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6 space-y-5">
                    <VoiceSelector
                        voices={ttsState.availableVoices}
                        selectedVoice={ttsState.selectedVoice}
                        hasIndonesianVoice={ttsState.hasIndonesianVoice}
                        isSupported={ttsState.isSupported}
                        onSelectVoice={onSelectVoice}
                    />
                    <SpeechRateSelector
                        currentRate={ttsState.rate}
                        isSupported={ttsState.isSupported}
                        onSelectRate={onSelectRate}
                    />
                </div>
            )}

            {/* Message Actions */}
            <MessageActions
                messageText={text}
                isTextEmpty={isTextEmptyOrWhitespace}
                isCopying={isCopying}
                copyFeedback={copyFeedback}
                onCopy={onCopyText}
                onClear={onClearText}
            />
        </div>
    );
}
