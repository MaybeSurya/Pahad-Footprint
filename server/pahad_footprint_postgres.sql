-- =============================================================================
-- Pahad Footprint Carbon Accounting & Field Guide — PostgreSQL Database Dump
-- Converted from SQLite (pahad_footprint_dev.sqlite)
-- Compatible with PostgreSQL 12, 13, 14, 15, 16+, Supabase, Neon, AWS RDS, Docker
-- Generated at: 2026-10-23T17:07:19.420Z
-- =============================================================================

-- Ensure transaction safety
BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Extensions
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 2. Custom Enumerated Types (Sequelize Compatible)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "enum_users_role" AS ENUM ('tourist', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "enum_trips_terrainZone" AS ENUM ('foothills', 'mid_hills', 'high_altitude');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 3. Table Structure for "users"
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,
  "role" "enum_users_role" NOT NULL DEFAULT 'tourist',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. Table Structure for "trips"
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "trips" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "routeName" VARCHAR(255) NOT NULL,
  "distanceKm" DOUBLE PRECISION NOT NULL,
  "terrainZone" "enum_trips_terrainZone" NOT NULL,
  "transportMode" VARCHAR(255) NOT NULL,
  "passengers" INTEGER NOT NULL DEFAULT 1,
  "nights" INTEGER NOT NULL DEFAULT 1,
  "accommodationType" VARCHAR(255) NOT NULL,
  "perPersonCo2e" DOUBLE PRECISION NOT NULL,
  "totalCo2e" DOUBLE PRECISION NOT NULL,
  "restorationPledged" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. Indexes for Performance
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "idx_trips_userId" ON "trips" ("userId");
CREATE INDEX IF NOT EXISTS "idx_trips_createdAt" ON "trips" ("createdAt");
CREATE INDEX IF NOT EXISTS "idx_trips_terrainZone" ON "trips" ("terrainZone");

-- -----------------------------------------------------------------------------
-- 6. Data Ingestion for "users" (2 records)
-- -----------------------------------------------------------------------------
INSERT INTO "users" ("id", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES (
  '60d2f3b9-e1ca-4257-917c-6d4fcbe14611'::uuid,
  'admin@pahadfootprint.gov.in',
  '$2a$10$95LNqsvxC5GM/T6yY2QXROhoZeDKJxoSDQ3XFPsLDrBowkvBKrztO',
  'admin'::"enum_users_role",
  '2026-10-22T09:13:25.699Z'::timestamptz,
  '2026-10-22T09:13:25.699Z'::timestamptz
)
ON CONFLICT ("id") DO UPDATE SET
  "email" = EXCLUDED."email",
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = EXCLUDED."role",
  "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "users" ("id", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES (
  '37ed8458-5c50-4217-b3c4-7ed2fd00beb1'::uuid,
  'tourist@pahadfootprint.org',
  '$2a$10$iBVvcUw6HpPFG6gWyvvM8.DyVY7ir07mSaXGl3Vzl5GaTb5f904SO',
  'tourist'::"enum_users_role",
  '2026-10-22T09:13:25.772Z'::timestamptz,
  '2026-10-22T09:13:25.772Z'::timestamptz
)
ON CONFLICT ("id") DO UPDATE SET
  "email" = EXCLUDED."email",
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = EXCLUDED."role",
  "updatedAt" = EXCLUDED."updatedAt";

-- -----------------------------------------------------------------------------
-- 7. Data Ingestion for "trips" (2 records)
-- -----------------------------------------------------------------------------
INSERT INTO "trips" (
  "id", "userId", "routeName", "distanceKm", "terrainZone",
  "transportMode", "passengers", "nights", "accommodationType",
  "perPersonCo2e", "totalCo2e", "restorationPledged", "createdAt", "updatedAt"
)
VALUES (
  'f30dc73f-f00d-48aa-b0e5-8d7ce27e0ec7'::uuid,
  '60d2f3b9-e1ca-4257-917c-6d4fcbe14611'::uuid,
  'Kumaon Hill Circuit: Kathgodam – Nainital – Mukteshwar – Almora (320 km)',
  320,
  'mid_hills'::"enum_trips_terrainZone",
  'suv',
  3,
  4,
  'hotel',
  55,
  165,
  FALSE,
  '2026-10-22T09:55:33.005Z'::timestamptz,
  '2026-10-22T09:55:33.005Z'::timestamptz
)
ON CONFLICT ("id") DO UPDATE SET
  "routeName" = EXCLUDED."routeName",
  "distanceKm" = EXCLUDED."distanceKm",
  "perPersonCo2e" = EXCLUDED."perPersonCo2e",
  "totalCo2e" = EXCLUDED."totalCo2e",
  "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "trips" (
  "id", "userId", "routeName", "distanceKm", "terrainZone",
  "transportMode", "passengers", "nights", "accommodationType",
  "perPersonCo2e", "totalCo2e", "restorationPledged", "createdAt", "updatedAt"
)
VALUES (
  'a38fbe1f-b992-4fe6-968a-9c7430b1e67a'::uuid,
  '60d2f3b9-e1ca-4257-917c-6d4fcbe14611'::uuid,
  'Dehradun → Harsil Apple Valley (428 km)',
  428,
  'high_altitude'::"enum_trips_terrainZone",
  'bus',
  45,
  14,
  'luxury',
  349,
  15703.9,
  FALSE,
  '2026-10-23T13:28:47.406Z'::timestamptz,
  '2026-10-23T13:28:47.406Z'::timestamptz
)
ON CONFLICT ("id") DO UPDATE SET
  "routeName" = EXCLUDED."routeName",
  "distanceKm" = EXCLUDED."distanceKm",
  "perPersonCo2e" = EXCLUDED."perPersonCo2e",
  "totalCo2e" = EXCLUDED."totalCo2e",
  "updatedAt" = EXCLUDED."updatedAt";

COMMIT;

-- Completed PostgreSQL Migration Dump
