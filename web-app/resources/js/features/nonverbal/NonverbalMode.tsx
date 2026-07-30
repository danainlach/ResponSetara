import React, { useState } from 'react';
import LiveAnnouncer from '../../components/accessibility/LiveAnnouncer';
import type { QuickPhraseItem, EmergencyCategoryItem } from './types';
import { useTextToSpeech } from './useTextToSpeech';
import { useNonverbalComposer } from './useNonverbalComposer';
import NonverbalComposer from './NonverbalComposer';
import QuickPhraseBrowser from './QuickPhraseBrowser';

interface NonverbalModeProps {
    initialPhrases?: QuickPhraseItem[];
    initialCategories?: EmergencyCategoryItem[];
    hasError?: boolean;
}

export default function NonverbalMode({
    initialPhrases = [],
    initialCategories = [],
    hasError = false,
}: NonverbalModeProps) {
    const [announcement, setAnnouncement] = useState<string>('');

    const tts = useTextToSpeech();

    const composer = useNonverbalComposer(() => {
        tts.stop();
        setAnnouncement('Semua teks telah dihapus dan suara dihentikan.');
    });

    const handleSelectPhrase = (phraseText: string, speechText?: string | null) => {
        composer.appendPhrase(phraseText, speechText);
        setAnnouncement(`Frasa ditambahkan: ${phraseText}`);
    };

    const handleSpeak = () => {
        if (!composer.isTextEmptyOrWhitespace) {
            tts.speak(composer.text);
            setAnnouncement('Mulai membacakan suara pesan darurat.');
        }
    };

    const handleRepeat = () => {
        if (!composer.isTextEmptyOrWhitespace) {
            tts.repeat(composer.text);
            setAnnouncement('Membaca ulang pesan darurat dari awal.');
        }
    };

    return (
        <div className="space-y-6">
            <LiveAnnouncer message={announcement} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (or Top on Mobile): Composer & Speech Controls */}
                <div className="lg:col-span-7 space-y-6">
                    <NonverbalComposer
                        text={composer.text}
                        characterCount={composer.characterCount}
                        maxLimit={composer.maxLimit}
                        isTextEmptyOrWhitespace={composer.isTextEmptyOrWhitespace}
                        isCopying={composer.isCopying}
                        copyFeedback={composer.copyFeedback}
                        ttsState={tts.state}
                        onTextChange={composer.handleTextChange}
                        onClearText={composer.clearText}
                        onCopyText={() => {
                            composer.copyText();
                            setAnnouncement('Teks berhasil disalin ke clipboard.');
                        }}
                        onSpeak={handleSpeak}
                        onPause={tts.pause}
                        onResume={tts.resume}
                        onStop={() => {
                            tts.stop();
                            setAnnouncement('Pemutaran suara dihentikan.');
                        }}
                        onRepeat={handleRepeat}
                        onSelectVoice={tts.setVoice}
                        onSelectRate={tts.setRate}
                    />
                </div>

                {/* Right Column (or Bottom on Mobile): Quick Phrase Database Browser */}
                <div className="lg:col-span-5">
                    <QuickPhraseBrowser
                        initialPhrases={initialPhrases}
                        categories={initialCategories}
                        hasError={hasError}
                        onSelectPhrase={handleSelectPhrase}
                    />
                </div>
            </div>
        </div>
    );
}
