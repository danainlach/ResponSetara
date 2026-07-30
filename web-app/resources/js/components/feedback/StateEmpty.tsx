import React from 'react';

interface StateEmptyProps {
    title?: string;
    description?: string;
}

export default function StateEmpty({ 
    title = 'Data belum tersedia.', 
    description = 'Informasi pada bagian ini belum dimasukkan atau sedang dalam tahap pembetulan spesifikasi sistem.' 
}: StateEmptyProps) {
    return (
        <div role="region" aria-label={title} className="rounded-2xl border border-teal-700/20 bg-teal-50 p-8 text-center my-4">
            <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>
            <p className="text-base text-ink-600 max-w-lg mx-auto">{description}</p>
        </div>
    );
}
