import { useState, useCallback } from 'react';
import type { ApiSuccessResponse, FetchStatus } from '../types/public-api';

export function usePublicApi<T>(endpoint: string, initialData?: T) {
    const [data, setData] = useState<T | undefined>(initialData);
    const [status, setStatus] = useState<FetchStatus>(initialData ? 'success' : 'idle');
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (customEndpoint?: string) => {
        const url = customEndpoint || endpoint;
        setStatus('loading');
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Terjadi kendala saat memuat informasi.');
            }

            const result: ApiSuccessResponse<T> = await response.json();

            if (result.success && result.data) {
                setData(result.data);

                if (Array.isArray(result.data) && result.data.length === 0) {
                    setStatus('empty');
                } else {
                    setStatus('success');
                }
            } else {
                setStatus('error');
                setError('Terjadi kendala saat memuat informasi.');
            }
        } catch {
            setStatus('error');
            setError('Terjadi kendala saat memuat informasi.');
        }
    }, [endpoint]);

    return { data, status, error, fetchData, setStatus };
}
