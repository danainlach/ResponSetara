import React from 'react';

interface StateSkeletonProps {
    lines?: number;
    title?: string;
}

export default function StateSkeleton({ lines = 3, title = 'Memuat informasi...' }: StateSkeletonProps) {
    return (
        <div role="status" aria-live="polite" className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs animate-pulse motion-reduce:animate-none">
            <span className="sr-only">{title}</span>
            <div className="h-6 w-1/3 rounded-md bg-slate-200 mb-4 motion-reduce:bg-slate-300"></div>
            {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className={`h-4 rounded-md bg-slate-200 mb-2.5 motion-reduce:bg-slate-300 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
            ))}
        </div>
    );
}
