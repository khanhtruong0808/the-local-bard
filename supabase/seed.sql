INSERT INTO
  "public"."addresses" (
    street_address,
    street_address_line_2,
    city,
    state,
    postal_code,
    country,
    latitude,
    longitude
  )
VALUES
  (
    '3165 Gold Valley Drive',
    NULL,
    'Rancho Cordova',
    'CA',
    95742,
    'United States',
    38.587790,
    -121.261319
  ),
  (
    '500 David J Stern Walk',
    NULL,
    'Sacramento',
    'CA',
    95814,
    'United States',
    38.580227,
    -121.499657
  );

INSERT INTO
  "public"."theaters" (
    name,
    phone,
    parking_instructions,
    notes,
    url,
    type,
    referred,
    concessions,
    address_id
  )
VALUES
  (
    'D3 RTMC',
    '1234567890',
    'Free parking in the lot',
    'Test location',
    'https://www.google.com',
    'Test type',
    'Referred by nobody',
    'No concessions',
    1
  ),
  (
    'Golden 1 Center',
    '9876543210',
    'Parking garages nearby',
    'Notes about Golden 1 Center',
    'https://www.golden1center.com/',
    'Indoor Arena',
    'Referred by nobody',
    'Plenty of food and drink for sale',
    2
  );

INSERT INTO
  "public"."stages" (
    theater_id,
    name,
    type,
    seating_capacity,
    wheelchair_accessible,
    notes
  )
VALUES
  (
    1,
    'Test stage 1',
    'amphitheater',
    1000,
    true,
    'Test notes'
  ),
  (
    2,
    'Test stage 2',
    'arena',
    10000,
    true,
    'Test notes'
  );

INSERT INTO
  "public"."productions" (
    stage_id,
    theater_id,
    name,
    type,
    summary,
    writers,
    directors,
    composers,
    kid_friendly,
    cost_range,
    duration_minutes,
    notes,
    url,
    start_date,
    end_date,
    poster_url
  )
VALUES
  (
    1,
    1,
    'Test production 1',
    'Test type',
    'Test summary',
    ARRAY ['Test writer 1', 'Test writer 2'],
    ARRAY ['Test director 1', 'Test director 2'],
    ARRAY ['Test composer 1', 'Test composer 2'],
    true,
    '$$$$',
    120,
    'Test notes',
    'https://www.google.com',
    '2024-01-01',
    '2024-01-10',
    'https://upload.wikimedia.org/wikipedia/en/6/67/LesMisLogo.png'
  ),
  (
    2,
    2,
    'Test production 2',
    'Basketball game',
    'Sacremento Kings vs. Los Angeles Lakers',
    NULL,
    NULL,
    NULL,
    true,
    '$$$$$$$$$$$$$$$$',
    150,
    'Test notes',
    'https://www.nba.com/kings/',
    '2024-01-01',
    '2024-01-10',
    'https://upload.wikimedia.org/wikipedia/en/c/c7/SacramentoKings.svg'
  );
