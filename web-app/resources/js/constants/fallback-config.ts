import type { SiteConfig, EmergencyContact } from '../types/public-api';

export const FALLBACK_CONFIG: Record<string, string> = {
    hero_headline: 'Komunikasi darurat yang dapat dipahami semua orang.',
    hero_description: 'Ubah teks menjadi suara, suara menjadi teks, dan susun pesan darurat secara cepat melalui satu halaman yang aksesibel.',
    cta_primary_text: 'Mulai Komunikasi Darurat',
    cta_secondary_text: 'Pelajari Cara Kerja',
    privacy_notice: 'Pesan dan transkripsi tidak disimpan oleh ResponSetara.',
    disclaimer_notice: 'ResponSetara membantu komunikasi dan tidak menggantikan layanan darurat resmi.',
};

export const FALLBACK_CONTACTS: EmergencyContact[] = [
    {
        id: 1,
        service_name: 'Layanan Medis & Ambulans 119',
        number: '119',
        scope: 'Nasional',
        coverage_note: 'Ambulans Gawat Darurat Kemenkes RI',
        source_name: 'Kemenkes RI',
        source_url: null,
        last_verified_at: null,
        sort_order: 1,
    },
    {
        id: 2,
        service_name: 'Layanan Darurat Terpadu 112',
        number: '112',
        scope: 'Bergantung Wilayah',
        coverage_note: 'Penerapan dan integrasi layanan 112 dapat berbeda menurut pemerintah daerah.',
        source_name: 'Komdigi RI',
        source_url: null,
        last_verified_at: null,
        sort_order: 2,
    },
    {
        id: 3,
        service_name: 'Kepolisian RI 110',
        number: '110',
        scope: 'Nasional',
        coverage_note: 'Bantuan Keamanan & Ketertiban',
        source_name: 'Polri',
        source_url: null,
        last_verified_at: null,
        sort_order: 3,
    },
    {
        id: 4,
        service_name: 'Pemadam Kebakaran 113',
        number: '113',
        scope: 'Daerah / Lokal',
        coverage_note: 'Kebakaran & Penyelamatan Darurat',
        source_name: 'Damkar',
        source_url: null,
        last_verified_at: null,
        sort_order: 4,
    }
];

export function getConfigValue(configs: SiteConfig[], key: string, fallbackKey: string): string {
    const item = configs.find(c => c.key === key);

    if (item && item.value) {
        return item.value;
    }

    return FALLBACK_CONFIG[fallbackKey] ?? '';
}
