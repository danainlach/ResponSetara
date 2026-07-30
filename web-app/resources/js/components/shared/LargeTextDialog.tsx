import React, { useEffect, useRef } from 'react';

interface LargeTextDialogProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export default function LargeTextDialog({
    isOpen,
    onClose,
    message
}: LargeTextDialogProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // Focus close button on open
        setTimeout(() => {
            closeBtnRef.current?.focus();
        }, 50);

        // Escape key handling & simple focus trap
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }

            if (e.key === 'Tab') {
                const focusables = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])');

                if (focusables && focusables.length > 0) {
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];

                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            ref={modalRef}
            role="dialog" 
            aria-modal="true" 
            aria-label="Tampilan Teks Besar Kontras Tinggi"
            className="fixed inset-0 z-50 flex flex-col justify-between bg-navy-900 text-white p-6 sm:p-10 lg:p-14 overflow-y-auto animate-in fade-in motion-reduce:animate-none"
        >
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
                <span className="inline-block rounded-xl bg-teal-50 px-4 py-1.5 text-sm sm:text-base font-extrabold text-navy-900">
                    🔍 Mode Teks Besar &amp; Kontras Tinggi
                </span>
                <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup mode teks besar (Tekan Escape)"
                    className="min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-xl bg-coral-600 px-5 py-2.5 text-base font-extrabold text-white shadow-md hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white transition-transform active:scale-95"
                >
                    ✕ Tutup (ESC)
                </button>
            </div>

            <div className="my-auto py-8 text-center max-w-5xl mx-auto w-full">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-snug sm:leading-tight uppercase tracking-wide break-words">
                    {message}
                </p>
            </div>

            <div className="pt-4 border-t border-navy-800 text-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto min-h-[54px] px-10 py-3 rounded-2xl bg-white text-navy-900 font-extrabold text-lg shadow-lg hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500"
                >
                    Kembali ke Layar Normal
                </button>
                <p className="mt-2 text-xs text-slate-400 font-medium">
                    Teks di atas ditampilkan secara mandiri dari memori sementara dan tidak dicatat atau disimpan di server.
                </p>
            </div>
        </div>
    );
}
