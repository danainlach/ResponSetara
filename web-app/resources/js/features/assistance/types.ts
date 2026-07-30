export interface EmergencyCategoryItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    is_active?: boolean;
}

export interface EmergencyConditionItem {
    id: number;
    category_id?: number | null;
    label: string;
    slug?: string;
    template_fragment?: string | null;
    is_active?: boolean;
}

export interface AssistanceTypeItem {
    id: number;
    category_id?: number | null;
    label: string;
    slug?: string;
    template_fragment?: string | null;
    is_active?: boolean;
}

export interface LocationState {
    manual_text: string;
    latitude: number | null;
    longitude: number | null;
    include_coordinates: boolean;
}

export interface ComposeRequestPayload {
    communication_mode: 'assistance';
    category_id: number;
    condition_ids: number[];
    assistance_type_ids: number[];
    location: {
        manual_text: string | null;
        latitude: number | null;
        longitude: number | null;
        include_coordinates: boolean;
    };
    additional_information: string | null;
    use_ai?: boolean;
    ai_consent?: boolean;
}

export interface ComposedMessageResult {
    source: 'template' | 'ai';
    message: string;
    template_message?: string;
    fallback_used?: boolean;
    fallback_reason?: string | null;
    selected: {
        category_id: number;
        condition_ids: number[];
        assistance_type_ids: number[];
    };
}

export type GeoStatus = 'idle' | 'locating' | 'success' | 'denied' | 'unsupported' | 'error';
