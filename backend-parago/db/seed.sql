-- Seed data for Parago PostgreSQL database

-- Insert mock vehicles
INSERT INTO vehicles (id, name, type, image_url, plate_number, description)
VALUES
    (gen_random_uuid(), 'Mercedes-Benz S-Class', 'Executive Sedan', '/vehicles/mercedes-s-class.jpg', 'PRG-7700', '2023 Long Wheelbase Edition – Midnight Obsidian'),
    (gen_random_uuid(), 'Toyota Innova', 'Luxury MPV', '/vehicles/toyota-innova.jpg', 'PRG-4410', '2024 Hybrid Zenix 2.0 – Pearl White'),
    (gen_random_uuid(), 'Honda Accord', 'Executive Sedan', '/vehicles/honda-accord.jpg', 'PRG-7235', '2024 Sport Edition VTEC – Aegean Blue'),
    (gen_random_uuid(), 'Ford Ranger', 'Utility Pickup', '/vehicles/ford-ranger.jpg', 'PRG-1234', '2022 Heavy‑Duty Pickup');

-- Insert mock drivers
INSERT INTO drivers (id, name, title, photo_url, rating, safe_miles, is_online)
VALUES
    (gen_random_uuid(), 'Marcus G. Sterling', 'Senior Fleet Specialist – 8 yrs', '/drivers/marcus-sterling.jpg', 4.98, 224000, TRUE),
    (gen_random_uuid(), 'Andi Wijaya', 'Fleet Lead – 5 yrs', '/drivers/andi-wijaya.jpg', 4.85, 180000, TRUE),
    (gen_random_uuid(), 'Siti Rahma', 'Operations Manager – 6 yrs', '/drivers/siti-rahma.jpg', 4.90, 200000, FALSE),
    (gen_random_uuid(), 'Budi Santoso', 'Driver – 3 yrs', '/drivers/budi-santoso.jpg', 4.70, 150000, TRUE),
    (gen_random_uuid(), 'Dewi Lestari', 'Driver – 4 yrs', '/drivers/dewi-lestari.jpg', 4.75, 160000, FALSE);

-- Insert mock bookings (linking to the above IDs via sub‑queries)
INSERT INTO bookings (id, booking_code, status, transaction_date, start_datetime, end_datetime, driver_id, vehicle_id, route, total_cost)
SELECT
    gen_random_uuid(),
    'BKG-8839', 'ongoing', DATE '2026-09-01', TIMESTAMP '2026-09-01 08:30', TIMESTAMP '2026-09-01 14:00',
    (SELECT id FROM drivers WHERE name = 'Marcus G. Sterling'),
    (SELECT id FROM vehicles WHERE name = 'Mercedes-Benz S-Class'),
    'Grand Peninsula Hotel → Teterboro Aviation Terminal', 1240000
UNION ALL SELECT gen_random_uuid(), 'BKG-7714', 'upcoming', DATE '2026-08-30', TIMESTAMP '2026-09-05 07:00', TIMESTAMP '2026-09-05 12:30',
    (SELECT id FROM drivers WHERE name = 'Andi Wijaya'),
    (SELECT id FROM vehicles WHERE name = 'Toyota Innova'),
    'Jakarta CBD → Bandung Conference Center', 560000
UNION ALL SELECT gen_random_uuid(), 'BKG-6601', 'completed', DATE '2026-08-28', TIMESTAMP '2026-08-28 09:00', TIMESTAMP '2026-08-28 13:45',
    (SELECT id FROM drivers WHERE name = 'Siti Rahma'),
    (SELECT id FROM vehicles WHERE name = 'Honda Accord'),
    'Surabaya HQ → Malang Industrial Park', 420000
UNION ALL SELECT gen_random_uuid(), 'BKG-5590', 'cancelled', DATE '2026-08-25', TIMESTAMP '2026-08-27 06:00', TIMESTAMP '2026-08-27 18:00',
    (SELECT id FROM drivers WHERE name = 'Budi Santoso'),
    (SELECT id FROM vehicles WHERE name = 'Ford Ranger'),
    'Semarang Depot → Surakarta Site', 0;
