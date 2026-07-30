import React from 'react';

interface StateErrorProps {
    message?: string;
    onRetry?: () => void;
}

export default function StateError({ 
    message = 'Terjadi kendala saat memuat informasi.', 
    onRetry 
}: StateErrorProps) {
    return (
        <div role="alert" aria-live="assertive" className="rounded-2xl border-2 border-coral-600/30 bg-coral-50 p-6 text-center text-ink-900 my-4">
            <h3 className="text-lg font-semibold mb-2">Kendala Informasi</h3>
            <p className="text-base text-ink-600 mb-4">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-coral-600 px-5 py-2.5 text-base font-semibold text-white shadow-xs hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-600/50 motion-reduce:transition-none"
                >
                    Coba Lagi
                </button>
            )}
        </div>
    );
}
