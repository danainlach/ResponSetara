import React, { useState } from 'react';
import type { HelperGuide } from '../../../types/public-api';
import StateSkeleton from '../../feedback/StateSkeleton';
import StateError from '../../feedback/StateError';
import StateEmpty from '../../feedback/StateEmpty';

interface HelperGuidesSectionProps {
    initialGuides: HelperGuide[];
    hasError?: boolean;
    onRetry?: () => void;
}

export default function HelperGuidesSection({ 
    initialGuides, 
    hasError = false, 
    onRetry 
}: HelperGuidesSectionProps) {
    const [showAll, setShowAll] = useState<boolean>(false);
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
    const [isLoading] = useState<boolean>(false);

    const displayedGuides = showAll ? initialGuides : initialGuides.slice(0, 4);

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getAudienceBadge = (audience: string) => {
        switch (audience) {
            case 'deaf':
                return { text: 'Untuk Pengguna Tuli', bg: 'bg-[var(--surface-soft)] text-[var(--text-secondary)] border-[var(--border)]' };
            case 'nonverbal':
                return { text: 'Untuk Pengguna Nonverbal', bg: 'bg-[var(--teal-soft)] text-[var(--text-primary)] border-[var(--teal)]' };
            default:
                return { text: 'Panduan Penolong Umum', bg: 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border-strong)]' };
        }
    };

    return (
        <section id="helper-guides" aria-labelledby="helper-guides-heading" className="py-10 border-t border-public-border scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <span className="inline-block rounded-full bg-teal-primary/10 px-4 py-1 text-xs sm:text-sm font-extrabold text-teal-primary uppercase tracking-wider border border-teal-primary/20">
                    Edukasi Kedaruratan Inklusif
                </span>
                <h2 id="helper-guides-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary tracking-tight">
                    Panduan Cepat Penolong
                </h2>
                <p className="text-base sm:text-lg text-text-secondary font-medium">
                    Panduan praktis berempati bagi masyarakat umum, relawan, maupun tenaga profesional saat memberikan pertolongan darurat.
                </p>
            </div>

            {isLoading && <StateSkeleton title="Memuat daftar panduan penolong..." lines={4} />}

            {hasError && (
                <StateError 
                    message="Terjadi kendala saat memuat panduan penolong dari server." 
                    onRetry={onRetry} 
                />
            )}

            {!isLoading && !hasError && initialGuides.length === 0 && (
                <StateEmpty 
                    title="Data belum tersedia." 
                    description="Belum ada panduan pertolongan cepat yang diterbitkan atau aktif pada kategori ini." 
                />
            )}

            {!isLoading && !hasError && initialGuides.length > 0 && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {displayedGuides.map((guide) => {
                            const badge = getAudienceBadge(guide.audience);
                            const isExpanded = !!expandedIds[guide.id];
                            const needsTruncate = guide.body && guide.body.length > 150;

                            return (
                                <div 
                                    key={guide.id} 
                                    className="public-card p-6 sm:p-7 shadow-card hover:shadow-card-hover hover:border-[var(--focus)] transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className={`inline-block rounded-xl px-3 py-1 text-xs font-black border uppercase tracking-wider ${badge.bg}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-extrabold text-text-primary mb-3 tracking-tight">
                                            {guide.title}
                                        </h3>
                                        <p className={`text-sm sm:text-base text-text-secondary leading-relaxed font-semibold whitespace-pre-line transition-all ${!isExpanded && needsTruncate ? 'line-clamp-3' : ''}`}>
                                            {guide.body}
                                        </p>
                                    </div>
                                    {needsTruncate && (
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(guide.id)}
                                            className="mt-4 self-start text-xs sm:text-sm font-extrabold text-teal-primary hover:text-teal-hover underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary"
                                        >
                                            {isExpanded ? 'Sembunyikan' : 'Baca Selengkapnya ➔'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {initialGuides.length > 4 && (
                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAll(prev => !prev)}
                                className="public-button-secondary min-h-[48px] inline-flex items-center justify-center px-8 py-3 text-base shadow-card transition-all public-focus-ring"
                            >
                                {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Panduan (${initialGuides.length}) ➔`}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
