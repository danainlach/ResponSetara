import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    description,
    confirmLabel = 'Konfirmasi & Simpan',
    cancelLabel = 'Batal',
    variant = 'warning',
    onConfirm,
    onCancel,
}: ConfirmationModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        confirmButtonRef.current?.focus();

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
            <div
                ref={modalRef}
                className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl transition-all"
                tabIndex={-1}
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-950 border border-amber-800 text-amber-400">
                        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3 id="modal-title" className="text-lg font-semibold text-white">
                            {title}
                        </h3>
                        <p id="modal-description" className="mt-2 text-sm text-zinc-300 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        aria-label="Tutup jendela konfirmasi"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white ${
                            variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-500'
                                : 'bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
