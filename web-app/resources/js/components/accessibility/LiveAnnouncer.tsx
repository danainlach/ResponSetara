import React from 'react';

interface LiveAnnouncerProps {
    message: string | null;
    ariaLive?: 'polite' | 'assertive';
}

export default function LiveAnnouncer({ message, ariaLive = 'polite' }: LiveAnnouncerProps) {
    return (
        <div aria-live={ariaLive} aria-atomic="true" className="sr-only">
            {message ? message : ''}
        </div>
    );
}
