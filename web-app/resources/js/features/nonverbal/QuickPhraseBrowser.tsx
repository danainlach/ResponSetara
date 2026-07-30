import React, { useState, useMemo } from 'react';
import StateEmpty from '../../components/feedback/StateEmpty';
import StateError from '../../components/feedback/StateError';
import type { QuickPhraseItem, EmergencyCategoryItem } from './types';
import QuickPhraseButton from './QuickPhraseButton';

interface QuickPhraseBrowserProps {
    initialPhrases: QuickPhraseItem[];
    categories: EmergencyCategoryItem[];
    hasError?: boolean;
    onSelectPhrase: (phraseText: string, speechText?: string | null) => void;
}

export default function QuickPhraseBrowser({
    initialPhrases,
    categories,
    hasError = false,
    onSelectPhrase,
}: QuickPhraseBrowserProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [phrases, setPhrases] = useState<QuickPhraseItem[]>(initialPhrases);
    const [apiError, setApiError] = useState<boolean>(hasError);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRetryFetch = async () => {
        setIsLoading(true);
        setApiError(false);

        try {
            const response = await fetch('/api/v1/quick-phrases?mode=nonverbal');

            if (!response.ok) {
                throw new Error('Gagal mengambil referensi frasa');
            }

            const json = await response.json();

            if (json && Array.isArray(json.data)) {
                setPhrases(json.data);
                setApiError(false);
            } else {
                setApiError(true);
            }
        } catch {
            setApiError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPhrases = useMemo(() => {
        return phrases.filter((item) => {
            // Category filter: match selected category or general (null)
            if (selectedCategoryId !== null) {
                if (item.category_id !== selectedCategoryId && item.category_id !== null && item.category_id !== undefined) {
                    return false;
                }
            }

            // Search query filter
            if (searchQuery.trim() !== '') {
                const term = searchQuery.toLowerCase().trim();
                const matchPhrase = item.phrase_text.toLowerCase().includes(term);
                const matchSpeech = item.speech_text ? item.speech_text.toLowerCase().includes(term) : false;
                const matchSimple = item.simplified_text ? item.simplified_text.toLowerCase().includes(term) : false;

                return matchPhrase || matchSpeech || matchSimple;
            }

            return true;
        });
    }, [phrases, selectedCategoryId, searchQuery]);

    return (
        <section aria-labelledby="quick-phrases-heading" className="rounded-2xl border-2 border-navy-800 bg-white p-4 sm:p-6 shadow-xs flex flex-col h-full">
            <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                    <h2 id="quick-phrases-heading" className="text-lg sm:text-xl font-bold text-navy-900">
                        Referensi Frasa Cepat
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
                        Klik tombol di bawah untuk menyisipkan frasa tanpa autoplay suara.
                    </p>
                </div>
            </div>

            {/* Search Box */}
            <div className="mb-4">
                <label htmlFor="search-phrase-input" className="sr-only">
                    Cari frasa darurat dari database
                </label>
                <div className="relative">
                    <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        🔍
                    </span>
                    <input
                        id="search-phrase-input"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari frasa (misal: ambulans, sakit, dokter)..."
                        className="w-full min-h-[48px] rounded-xl border-2 border-slate-300 bg-slate-50 pl-10 pr-4 py-2 text-sm sm:text-base text-ink-900 placeholder:text-slate-400 font-semibold focus:border-teal-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-colors"
                    />
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter Frasa Berdasarkan Kategori">
                <button
                    type="button"
                    onClick={() => setSelectedCategoryId(null)}
                    aria-pressed={selectedCategoryId === null}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 ${
                        selectedCategoryId === null
                            ? 'bg-teal-800 text-white shadow-sm'
                            : 'bg-slate-100 text-ink-600 hover:bg-slate-200'
                    }`}
                >
                    Semua Kategori
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(cat.id)}
                        aria-pressed={selectedCategoryId === cat.id}
                        className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 ${
                            selectedCategoryId === cat.id
                                ? 'bg-teal-800 text-white shadow-sm'
                                : 'bg-slate-100 text-ink-600 hover:bg-slate-200'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Content Display Grid */}
            <div className="flex-1 overflow-y-auto max-h-[620px] pr-1 space-y-2.5">
                {isLoading ? (
                    <div className="p-8 text-center text-ink-600 font-semibold animate-pulse">
                        Memuat referensi frasa darurat...
                    </div>
                ) : apiError ? (
                    <StateError
                        message="Gagal memuat daftar frasa cepat darurat dari server."
                        onRetry={handleRetryFetch}
                    />
                ) : filteredPhrases.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5">
                        {filteredPhrases.map((phrase) => (
                            <QuickPhraseButton
                                key={phrase.id}
                                phrase={phrase}
                                onSelect={onSelectPhrase}
                            />
                        ))}
                    </div>
                ) : (
                    <StateEmpty
                        title="Frasa tidak ditemukan"
                        description={searchQuery ? `Tidak ada frasa darurat yang sesuai dengan kata kunci "${searchQuery}".` : 'Daftar frasa untuk kategori ini sedang dimuat di sistem database.'}
                    />
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 font-semibold text-center">
                *Seluruh referensi frasa bersumber dari database publik ResponSetara (murni berbasis teks resmi).
            </div>
        </section>
    );
}
