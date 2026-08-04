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
            {/* Strict Privacy Banner */}
            <div role="region" aria-label="Informasi Privasi Penggunaan" className="rounded-[22px] border border-teal-primary/20 bg-teal-primary/10 p-5 shadow-card flex items-start gap-3">
                <span className="text-xl sm:text-2xl mt-0.5" aria-hidden="true">🔒</span>
                <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-text-primary">
                        Jaminan Privasi Mutlak
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed mt-0.5">
                        ResponSetara tidak menyimpan pesan atau audio. Pemrosesan suara dapat mengikuti layanan yang digunakan oleh browser Anda.
                    </p>
                </div>
            </div>

            {/* Textarea Input Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nonverbal-textarea" className="text-base sm:text-lg font-extrabold text-text-primary">
                        Teks Pesan Anda (Ketik atau Pilih Frasa)
                    </label>
                    <span 
                        id="char-counter"
                        role="status" 
                        aria-live="polite"
                        className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${
                            isOverLimit ? 'bg-coral-emergency/10 text-coral-emergency border-coral-emergency/20' : 'bg-public-surface-muted text-text-secondary border-public-border'
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
                    rows={6}
                    aria-describedby="char-counter privacy-note"
                    placeholder="Ketik pesan yang ingin disampaikan atau pilih referensi frasa cepat di samping/bawah..."
                    className="w-full rounded-[22px] border border-public-border bg-[var(--surface)] p-5 text-base sm:text-lg font-bold text-text-primary leading-relaxed placeholder:text-public-text-muted focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] transition-all resize-y min-h-[190px] shadow-xs"
                />

                {isOverLimit && (
                    <p role="alert" className="text-xs sm:text-sm text-coral-emergency font-extrabold">
                        ⚠️ Anda telah mencapai batas maksimal {maxLimit} karakter.
                    </p>
                )}
                <p id="privacy-note" className="text-xs text-text-secondary font-medium italic">
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
                <div className="rounded-[22px] border border-public-border bg-public-surface-muted p-6 space-y-5 shadow-sm">
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
