import React from 'react';
import type { SVGProps } from 'react';

interface ResponSetaraMarkProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

export default function ResponSetaraMark({ size = 32, ...props }: ResponSetaraMarkProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            {/* Shield & Speech Contour */}
            <path
                d="M20 2C10 2 3 7.5 3 16C3 20.8 5.5 24.8 9.5 27.2L8 35L17.5 30.2C18.3 30.4 19.1 30.5 20 30.5C30 30.5 37 25 37 16.5C37 8 30 2 20 2Z"
                fill="url(#brand-gradient)"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Balanced Equality Lines (Setara) */}
            <path
                d="M13 13.5H27"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <path
                d="M13 19.5H27"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            
            <defs>
                <linearGradient id="brand-gradient" x1="3" y1="2" x2="37" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#13B8A6" />
                    <stop stopColor="#20C7B5" />
                </linearGradient>
            </defs>
        </svg>
    );
}
