-- REFERENSI SKEMA POSTGRESQL RESPONSETARA
-- Laravel migrations tetap menjadi sumber implementasi utama.
-- Tidak ada tabel Kartu Darurat atau Piktogram.

CREATE SCHEMA IF NOT EXISTS responsetara;

CREATE TABLE IF NOT EXISTS responsetara.emergency_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.emergency_conditions (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES responsetara.emergency_categories(id),
    code VARCHAR(120) NOT NULL UNIQUE,
    label VARCHAR(180) NOT NULL,
    description TEXT,
    template_fragment TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.assistance_types (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES responsetara.emergency_categories(id),
    code VARCHAR(120) NOT NULL UNIQUE,
    label VARCHAR(180) NOT NULL,
    description TEXT,
    template_fragment TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.quick_phrases (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES responsetara.emergency_categories(id),
    mode VARCHAR(30) NOT NULL CHECK (mode IN ('general','nonverbal','deaf')),
    phrase_text TEXT NOT NULL,
    speech_text TEXT,
    simplified_text TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low','medium','high')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.helper_guides (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(30) NOT NULL
        CHECK (audience IN ('general','nonverbal','deaf')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.emergency_contacts (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(180) NOT NULL,
    number VARCHAR(40) NOT NULL,
    scope VARCHAR(180) NOT NULL,
    coverage_note TEXT,
    source_name VARCHAR(180),
    source_url TEXT,
    last_verified_at DATE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS responsetara.site_contents (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(180) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    content_type VARCHAR(30) NOT NULL DEFAULT 'text',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_categories_active_order
ON responsetara.emergency_categories (is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_conditions_category_active
ON responsetara.emergency_conditions (category_id, is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_assistance_category_active
ON responsetara.assistance_types (category_id, is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_phrases_mode_category_active
ON responsetara.quick_phrases (mode, category_id, is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_contacts_active_verified
ON responsetara.emergency_contacts (is_active, is_verified, sort_order);
