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
                return { text: 'Untuk Pengguna Tuli', bg: 'bg-navy-900 text-white border-navy-800' };
            case 'nonverbal':
                return { text: 'Untuk Pengguna Nonverbal', bg: 'bg-teal-500/20 text-teal-800 border-teal-600/30' };
            default:
                return { text: 'Panduan Penolong Umum', bg: 'bg-slate-100 text-navy-900 border-slate-300' };
        }
    };

    return (
        <section id="helper-guides" aria-labelledby="helper-guides-heading" className="py-10 border-t border-border-subtle scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <span className="inline-block rounded-full bg-teal-50 px-4 py-1 text-xs sm:text-sm font-extrabold text-teal-800 uppercase tracking-wider border border-teal-600/30">
                    Edukasi Kedaruratan Inklusif
                </span>
                <h2 id="helper-guides-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">
                    Panduan Cepat Penolong
                </h2>
                <p className="text-base sm:text-lg text-ink-600 font-medium">
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
                                    className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className={`inline-block rounded-xl px-3 py-1 text-xs font-black border uppercase tracking-wider ${badge.bg}`}>
                                                {badge.text}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 mb-3 tracking-tight">
                                            {guide.title}
                                        </h3>
                                        <p className={`text-sm sm:text-base text-ink-600 leading-relaxed font-medium whitespace-pre-line transition-all ${!isExpanded && needsTruncate ? 'line-clamp-3' : ''}`}>
                                            {guide.body}
                                        </p>
                                    </div>
                                    {needsTruncate && (
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(guide.id)}
                                            className="mt-4 self-start text-xs sm:text-sm font-extrabold text-teal-700 hover:text-teal-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
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
                                className="min-h-[48px] inline-flex items-center justify-center rounded-2xl border-2 border-navy-900 bg-white px-8 py-3 text-base font-extrabold text-navy-900 shadow-sm hover:bg-navy-900 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors"
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
