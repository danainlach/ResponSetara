import React from 'react';
import ResponSetaraMark from './ResponSetaraMark';

interface ResponSetaraLogoProps {
    markSize?: number;
    showDescriptor?: boolean;
    darkTheme?: boolean;
}

export default function ResponSetaraLogo({
    markSize = 36,
    showDescriptor = false,
    darkTheme = true
}: ResponSetaraLogoProps) {
    return (
        <div className="flex items-center space-x-3 select-none">
            <ResponSetaraMark size={markSize} className="shrink-0 text-teal-accent" />
            <div className="flex flex-col text-left">
                <span className={`font-black text-xl tracking-tight leading-none ${
                    darkTheme ? 'text-white' : 'text-midnight-950'
                }`}>
                Respon<span className={darkTheme ? 'text-teal-glow' : 'text-teal-primary'}>Setara</span>
                </span>
                {showDescriptor && (
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                        darkTheme ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                        Komunikasi Darurat Inklusif
                    </span>
                )}
            </div>
        </div>
    );
}
