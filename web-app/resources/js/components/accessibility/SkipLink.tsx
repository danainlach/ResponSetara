import React from 'react';

export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-teal-700 focus:px-5 focus:py-3 focus:text-base focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-coral-600"
        >
            Lanjutkan ke Konten Utama (Skip to Content)
        </a>
    );
}
