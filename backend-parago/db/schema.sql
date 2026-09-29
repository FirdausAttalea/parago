-- PostgreSQL schema for Parago fleet management
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
    plate_number TEXT,
    description TEXT
);

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    photo_url TEXT,
    rating NUMERIC(3,2),
    safe_miles BIGINT,
    is_online BOOLEAN DEFAULT FALSE
);

CREATE TYPE booking_status AS ENUM ('ongoing', 'upcoming', 'completed', 'cancelled');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code TEXT NOT NULL UNIQUE,
    status booking_status NOT NULL,
    transaction_date DATE NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    duration INTERVAL GENERATED ALWAYS AS (end_datetime - start_datetime) STORED,
    driver_id UUID REFERENCES drivers(id),
    vehicle_id UUID REFERENCES vehicles(id),
    route TEXT,
    total_cost BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: store invoice PDF path
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    pdf_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1. Table untuk detail booking yang tidak masuk ke tabel bookings utama
CREATE TABLE booking_details (
    booking_id UUID PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
    category TEXT,
    vehicle_tag TEXT,
    vehicle_subtitle TEXT,
    estimated_revenue NUMERIC(12,2),
    revenue_note TEXT,
    trip_progress JSONB,               -- {currentKm, totalKm, percent}
    pickup JSONB,                      -- {time, name, address, note}
    destination JSONB,                 -- {time, name, address}
    vehicle_specs JSONB,               -- [{label, value, valueColor}, …]
    telemetry JSONB,                   -- [{label, value, valueColor}, …]
    system_logs JSONB,                 -- [{event, timestamp, identity, status}, …]
    booking_party JSONB,               -- {name, tier, accountId, attn, phone, note}
    status_history JSONB               -- [{label, timestamp, source, state}, …]
);

-- 2. Jika ingin menormalisasi (opsional)
CREATE TABLE booking_parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    name TEXT,
    tier TEXT,
    account_id TEXT,
    attn TEXT,
    phone TEXT,
    note TEXT
);

CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    label TEXT,
    ts TIMESTAMP WITH TIME ZONE,
    source TEXT,
    state VARCHAR(10) CHECK (state IN ('done','active','pending'))
);
