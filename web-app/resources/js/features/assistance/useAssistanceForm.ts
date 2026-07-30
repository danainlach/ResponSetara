import { useState, useCallback } from 'react';
import type { 
    EmergencyCategoryItem, 
    EmergencyConditionItem, 
    AssistanceTypeItem, 
    ComposedMessageResult, 
    GeoStatus 
} from './types';

interface UseAssistanceFormProps {
    categories: EmergencyCategoryItem[];
    conditions: EmergencyConditionItem[];
    assistanceTypes: AssistanceTypeItem[];
}

export function useAssistanceForm({ categories, conditions, assistanceTypes }: UseAssistanceFormProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedConditionIds, setSelectedConditionIds] = useState<number[]>([]);
    const [selectedAssistanceIds, setSelectedAssistanceIds] = useState<number[]>([]);
    const [locationText, setLocationText] = useState<string>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [includeCoordinates, setIncludeCoordinates] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [useAi, setUseAi] = useState<boolean>(false);
    const [aiConsent, setAiConsent] = useState<boolean>(false);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [composedResult, setComposedResult] = useState<ComposedMessageResult | null>(null);
    const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [announcement, setAnnouncement] = useState<string | null>(null);

    const handleToggleUseAi = useCallback((checked: boolean) => {
        setUseAi(checked);

        if (!checked) {
            setAiConsent(false);
        }
    }, []);

    const handleToggleAiConsent = useCallback((checked: boolean) => {
        setAiConsent(checked);
    }, []);

    // Filter available conditions and assistance types based on category or general (null)
    const availableConditions = conditions.filter(
        c => c.category_id === null || c.category_id === undefined || c.category_id === selectedCategoryId
    );

    const availableAssistanceTypes = assistanceTypes.filter(
        a => a.category_id === null || a.category_id === undefined || a.category_id === selectedCategoryId
    );

    const handleSelectCategory = useCallback((categoryId: number) => {
        setSelectedCategoryId(categoryId);
        setValidationErrors(prev => {
            const next = { ...prev };
            delete next['category_id'];

            return next;
        });
        setAnnouncement('Kategori darurat dipilih. Daftar kondisi dan bantuan telah diperbarui.');

        // Prune any non-matching conditions or assistance types that belong to a different category
        setSelectedConditionIds(prev => prev.filter(id => {
            const found = conditions.find(c => c.id === id);

            return found && (found.category_id === null || found.category_id === undefined || found.category_id === categoryId);
        }));
        setSelectedAssistanceIds(prev => prev.filter(id => {
            const found = assistanceTypes.find(a => a.id === id);

            return found && (found.category_id === null || found.category_id === undefined || found.category_id === categoryId);
        }));
    }, [conditions, assistanceTypes]);

    const handleToggleCondition = useCallback((id: number) => {
        setSelectedConditionIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }

            if (prev.length >= 3) {
                setAnnouncement('Batas maksimal 3 kondisi telah dicapai.');

                return prev;
            }

            return [...prev, id];
        });
    }, []);

    const handleToggleAssistance = useCallback((id: number) => {
        setSelectedAssistanceIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }

            if (prev.length >= 3) {
                setAnnouncement('Batas maksimal 3 jenis bantuan telah dicapai.');

                return prev;
            }

            return [...prev, id];
        });
    }, []);

    const handleLocationTextChange = useCallback((text: string) => {
        setLocationText(text.slice(0, 180));

        if (validationErrors['location.manual_text']) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next['location.manual_text'];

                return next;
            });
        }
    }, [validationErrors]);

    const handleAdditionalInfoChange = useCallback((text: string) => {
        setAdditionalInfo(text.slice(0, 300));

        if (validationErrors['additional_information']) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next['additional_information'];

                return next;
            });
        }
    }, [validationErrors]);

    const requestGeolocation = useCallback(() => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            setGeoStatus('unsupported');
            setAnnouncement('Layanan geoloksasi tidak didukung oleh browser Anda. Silakan isi lokasi manual.');

            return;
        }

        setGeoStatus('locating');
        setAnnouncement('Sedang mengambil koordinat perangkat...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setIncludeCoordinates(true);
                setGeoStatus('success');
                setAnnouncement('Koordinat perangkat berhasil diraih. Data ini tidak akan disimpan di server.');
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setGeoStatus('denied');
                    setAnnouncement('Izin lokasi ditolak oleh browser. Silakan ketik lokasi manual pada kotak di bawah.');
                } else {
                    setGeoStatus('error');
                    setAnnouncement('Gagal mendapatkan koordinat perangkat. Silakan gunakan lokasi manual.');
                }
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    const handleSubmit = useCallback(async () => {
        const errors: Record<string, string[]> = {};

        if (!selectedCategoryId) {
            errors['category_id'] = ['Silakan pilih jenis situasi darurat Anda terlebih dahulu.'];
        }

        if (selectedConditionIds.length > 3) {
            errors['condition_ids'] = ['Pilih maksimal 3 kondisi darurat.'];
        }

        if (selectedAssistanceIds.length > 3) {
            errors['assistance_type_ids'] = ['Pilih maksimal 3 jenis bantuan yang dibutuhkan.'];
        }

        if (useAi && !aiConsent) {
            errors['ai_consent'] = ['Anda wajib mendaftarkan persetujuan (consent) sebelum memproses informasi menggunakan penyedia AI.'];
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setAnnouncement('Validasi form gagal. Silakan periksa pesan kesalahan pada formulir.');
            const errorSummaryElem = document.getElementById('error-summary-box');

            if (errorSummaryElem) {
                errorSummaryElem.focus();
            }

            return;
        }

        setIsSubmitting(true);
        setValidationErrors({});

        const payload = {
            communication_mode: 'assistance' as const,
            category_id: selectedCategoryId!,
            condition_ids: selectedConditionIds,
            assistance_type_ids: selectedAssistanceIds,
            location: {
                manual_text: locationText.trim() ? locationText.trim() : null,
                latitude: includeCoordinates ? latitude : null,
                longitude: includeCoordinates ? longitude : null,
                include_coordinates: includeCoordinates,
            },
            additional_information: additionalInfo.trim() ? additionalInfo.trim() : null,
            use_ai: useAi,
            ai_consent: aiConsent,
        };

        try {
            const response = await fetch('/api/v1/compose-message', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 422) {
                const data = await response.json();

                if (data && data.errors) {
                    setValidationErrors(data.errors);
                    setAnnouncement('Validasi form gagal di sisi server.');
                    const errorSummaryElem = document.getElementById('error-summary-box');

                    if (errorSummaryElem) {
                        errorSummaryElem.focus();
                    }
                }

                setIsSubmitting(false);

                return;
            }

            if (!response.ok) {
                throw new Error('Server merespons kendala teknis.');
            }

            const resData = await response.json();

            if (resData && resData.success && resData.data) {
                setComposedResult(resData.data);
                setAnnouncement('Pesan bantuan darurat berhasil disusun. Fokus berpindah ke hasil pesan.');
            } else {
                throw new Error('Format balikan tidak valid.');
            }
        } catch {
            // Offline fallback deterministic template builder (ensures uninterrupted emergency support)
            const cat = categories.find(c => c.id === selectedCategoryId);
            const conds = selectedConditionIds
                .map(id => conditions.find(c => c.id === id))
                .filter(Boolean)
                .map(c => c!.template_fragment || c!.label);
            const assts = selectedAssistanceIds
                .map(id => assistanceTypes.find(a => a.id === id))
                .filter(Boolean)
                .map(a => a!.template_fragment || a!.label);

            const cleanFrag = (str: string): string => {
                let cleaned = str.trim();

                while (cleaned.endsWith('.') || cleaned.endsWith(' ')) {
                    cleaned = cleaned.slice(0, -1).trim();
                }

                cleaned = cleaned.replace(/^(Kondisi|Bantuan|Catatan)\s*:\s*/i, '');

                return cleaned.trim();
            };

            const sections: string[] = [];
            const catName = cat ? cat.name : 'Darurat';
            sections.push(`DARURAT: ${catName.trim()}`);

            const locLines: string[] = [];

            if (locationText.trim()) {
                locLines.push(locationText.trim());
            }

            if (includeCoordinates && latitude !== null && longitude !== null) {
                locLines.push(`Koordinat: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
            }

            if (locLines.length > 0) {
                sections.push(`Lokasi:\n${locLines.join('\n')}`);
            }

            if (conds.length > 0) {
                const cleanedConds = conds.map(cleanFrag).filter(Boolean);

                if (cleanedConds.length > 0) {
                    sections.push(`Kondisi:\n${cleanedConds.join('. ')}.`);
                }
            }

            if (assts.length > 0) {
                const cleanedAssts = assts.map(cleanFrag).filter(Boolean);

                if (cleanedAssts.length > 0) {
                    sections.push(`Bantuan yang diperlukan:\n${cleanedAssts.join('. ')}.`);
                }
            }

            if (additionalInfo.trim()) {
                const cleanedNote = cleanFrag(additionalInfo.trim());

                if (cleanedNote) {
                    sections.push(`Catatan:\n${cleanedNote}.`);
                }
            }

            let offlineMsg = sections.join('\n\n');
            offlineMsg = offlineMsg.replace(/ \./g, '.').replace(/\.{2,}/g, '.').trim();

            setComposedResult({
                source: 'template',
                message: offlineMsg,
                template_message: offlineMsg,
                fallback_used: true,
                fallback_reason: 'provider_error',
                selected: {
                    category_id: selectedCategoryId!,
                    condition_ids: selectedConditionIds,
                    assistance_type_ids: selectedAssistanceIds,
                },
            });
            setAnnouncement('Pesan disusun secara lokal offline menggunakan template. Fokus berpindah ke hasil pesan.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                const previewElem = document.getElementById('message-preview-card');

                if (previewElem) {
                    previewElem.focus();
                    previewElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [
        selectedCategoryId, 
        selectedConditionIds, 
        selectedAssistanceIds, 
        locationText, 
        includeCoordinates, 
        latitude, 
        longitude, 
        additionalInfo, 
        useAi,
        aiConsent,
        categories, 
        conditions, 
        assistanceTypes
    ]);

    const resetForm = useCallback(() => {
        setSelectedCategoryId(null);
        setSelectedConditionIds([]);
        setSelectedAssistanceIds([]);
        setLocationText('');
        setLatitude(null);
        setLongitude(null);
        setIncludeCoordinates(false);
        setAdditionalInfo('');
        setUseAi(false);
        setAiConsent(false);
        setComposedResult(null);
        setGeoStatus('idle');
        setValidationErrors({});
        setAnnouncement('Formulir bantuan darurat telah diatur ulang ke kondisi awal.');
        
        setTimeout(() => {
            const firstCategoryInput = document.getElementById('category-selector-box');

            if (firstCategoryInput) {
                firstCategoryInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }, []);

    const handleEditInformation = useCallback(() => {
        setComposedResult(null);
        setAnnouncement('Mengubah informasi pesan. Fokus kembali ke formulir.');
        setTimeout(() => {
            const firstCategoryInput = document.getElementById('category-selector-box');

            if (firstCategoryInput) {
                firstCategoryInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }, []);

    const handleSwitchVersion = useCallback((version: 'ai' | 'template') => {
        setComposedResult(prev => {
            if (!prev) {
                return prev;
            }

            if (version === 'template' && prev.template_message) {
                return {
                    ...prev,
                    message: prev.template_message,
                    source: 'template',
                };
            }

            return prev;
        });
    }, []);

    return {
        selectedCategoryId,
        selectedConditionIds,
        selectedAssistanceIds,
        locationText,
        includeCoordinates,
        latitude,
        longitude,
        additionalInfo,
        useAi,
        aiConsent,
        isSubmitting,
        composedResult,
        geoStatus,
        validationErrors,
        announcement,
        availableConditions,
        availableAssistanceTypes,
        handleSelectCategory,
        handleToggleCondition,
        handleToggleAssistance,
        handleLocationTextChange,
        handleAdditionalInfoChange,
        handleToggleUseAi,
        handleToggleAiConsent,
        requestGeolocation,
        handleSubmit,
        resetForm,
        handleEditInformation,
        handleSwitchVersion,
    };
}
