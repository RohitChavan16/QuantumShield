CREATE TABLE IF NOT EXISTS cryptographic_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_identifier VARCHAR(255) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    key_length INTEGER,
    status VARCHAR(50) NOT NULL,
    is_quantum_safe BOOLEAN DEFAULT false,
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);
