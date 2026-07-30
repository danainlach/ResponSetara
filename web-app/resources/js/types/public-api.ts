export interface ApiMeta {
    version: string;
    count?: number;
}

export interface ApiSuccessResponse<T> {
    success: boolean;
    data: T;
    meta?: ApiMeta;
    message?: string;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export interface SiteConfig {
    key: string;
    value: string;
    content_type: string;
}

export interface EmergencyCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    sort_order: number;
}

export interface HelperGuide {
    id: number;
    title: string;
    body: string;
    audience: 'general' | 'nonverbal' | 'deaf';
    sort_order: number;
}

export interface EmergencyContact {
    id: number;
    service_name: string;
    number: string;
    scope: string;
    coverage_note: string | null;
    source_name: string | null;
    source_url: string | null;
    last_verified_at: string | null;
    sort_order: number;
}

export interface CommunicationModeCard {
    id: 'help-me' | 'cannot-speak' | 'cannot-hear';
    title: string;
    description: string;
    ariaLabel: string;
    badgeColor: string;
}

export interface LandingPageProps {
    configs: SiteConfig[];
    categories: EmergencyCategory[];
    helperGuides: HelperGuide[];
    emergencyContacts: EmergencyContact[];
    hasError?: boolean;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';
