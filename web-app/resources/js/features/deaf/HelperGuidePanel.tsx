import React, { useState } from 'react';
import StateEmpty from '../../components/feedback/StateEmpty';
import StateError from '../../components/feedback/StateError';
import type { HelperGuideItem } from './types';

interface HelperGuidePanelProps {
    initialGuides: HelperGuideItem[];
    hasError?: boolean;
}

export default function HelperGuidePanel({
    initialGuides,
    hasError = false,
}: HelperGuidePanelProps) {
    const [guides, setGuides] = useState<HelperGuideItem[]>(initialGuides);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(hasError);

    const fetchGuidesAgain = async () => {
        setIsLoading(true);
        setError(false);

        try {
            const res = await fetch('/api/v1/helper-guides?audience=deaf');

            if (!res.ok) {
                throw new Error('Gagal memuat panduan dari API');
            }

            const data = await res.json();

            if (data && Array.isArray(data.data)) {
                setGuides(data.data);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            aria-labelledby="helper-guides-title"
            className="rounded-[22px] border border-public-border bg-card p-6 shadow-card h-full flex flex-col justify-between"
        >
            <div>
                <div className="border-b border-public-border pb-3 mb-4">
                    <h2 id="helper-guides-title" className="text-lg sm:text-xl font-extrabold text-text-primary flex items-center gap-2">
                        <span aria-hidden="true">💡</span>
                        <span>Panduan Untuk Penolong</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-text-secondary font-semibold mt-1">
                        Tips komunikasi efektif dari database untuk berinteraksi dengan pengguna tuli atau gangguan pendengaran:
                    </p>
                </div>

                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3">
                        <div className="h-8 w-8 border-4 border-teal-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-semibold text-text-secondary">Memuat tips dari database...</p>
                    </div>
                ) : error ? (
                    <StateError
                        message="Gagal memuat daftar panduan penolong dari database saat ini."
                        onRetry={fetchGuidesAgain}
                    />
                ) : guides.length === 0 ? (
                    <StateEmpty
                        title="Belum ada panduan tersedia"
                        description="Belum ada tips panduan penolong berstatus aktif untuk kategori ini di dalam database."
                    />
                ) : (
                    <ul className="space-y-4 my-2" role="list">
                        {guides.map((guide, idx) => (
                            <li
                                key={guide.id || idx}
                                className="rounded-xl border border-public-border bg-public-surface-muted p-4 hover:bg-public-selected hover:border-teal-primary/60 transition-all duration-200"
                            >
                                <h3 className="text-sm sm:text-base font-extrabold text-text-primary flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-primary text-white font-black text-xs shrink-0">
                                        {idx + 1}
                                    </span>
                                    <span>{guide.title}</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-text-secondary font-semibold mt-2 pl-8 leading-relaxed">
                                    {guide.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-public-border text-center sm:text-left">
                <p className="text-xs text-text-secondary font-semibold italic">
                    *Panduan bersumber secara real-time dari endpoint <code>/api/v1/helper-guides</code>.</p>
            </div>
        </section>
    );
}
