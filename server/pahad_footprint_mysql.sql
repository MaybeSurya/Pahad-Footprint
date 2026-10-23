-- =============================================================================
-- Pahad Footprint Carbon Accounting & Field Guide — MySQL Database Dump
-- Converted from SQLite (pahad_footprint_dev.sqlite)
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, AWS RDS, Google Cloud SQL
-- Generated at: 2026-10-23T16:50:44.189Z
-- =============================================================================

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET @OLD_TIME_ZONE=@@TIME_ZONE;
SET TIME_ZONE='+00:00';

-- -----------------------------------------------------------------------------
-- 1. Create Database
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `pahad_footprint`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `pahad_footprint`;

-- -----------------------------------------------------------------------------
-- 2. Table Structure for `users`
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL COMMENT 'UUID v4 identifier',
  `email` VARCHAR(255) NOT NULL COMMENT 'User email address',
  `passwordHash` VARCHAR(255) NOT NULL COMMENT 'Bcrypt encrypted password hash',
  `role` ENUM('tourist', 'admin') NOT NULL DEFAULT 'tourist' COMMENT 'Access role',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pahad Footprint User Accounts';

-- -----------------------------------------------------------------------------
-- 3. Table Structure for `trips`
-- -----------------------------------------------------------------------------
CREATE TABLE `trips` (
  `id` VARCHAR(36) NOT NULL COMMENT 'UUID v4 identifier',
  `userId` VARCHAR(36) NULL COMMENT 'Associated user if authenticated',
  `routeName` VARCHAR(255) NOT NULL COMMENT 'Origin and destination route title',
  `distanceKm` DOUBLE NOT NULL COMMENT 'Travel distance in kilometres',
  `terrainZone` ENUM('foothills', 'mid_hills', 'high_altitude') NOT NULL COMMENT 'Elevation slope factor zone',
  `transportMode` VARCHAR(255) NOT NULL COMMENT 'Transport mode (e.g. suv, sedan, bus, ev)',
  `passengers` INT NOT NULL DEFAULT 1 COMMENT 'Number of travelers sharing vehicle',
  `nights` INT NOT NULL DEFAULT 1 COMMENT 'Duration of mountain stay in nights',
  `accommodationType` VARCHAR(255) NOT NULL COMMENT 'Accommodation class (luxury, hotel, homestay, camp)',
  `perPersonCo2e` DOUBLE NOT NULL COMMENT 'Net carbon footprint per person in kg CO2e',
  `totalCo2e` DOUBLE NOT NULL COMMENT 'Gross total trip footprint in kg CO2e',
  `restorationPledged` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Whether traveler pledged native Banj oak trees',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trips_userId` (`userId`),
  KEY `idx_trips_createdAt` (`createdAt`),
  KEY `idx_trips_terrainZone` (`terrainZone`),
  CONSTRAINT `fk_trips_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Himalayan Trip Footprint Records';

-- -----------------------------------------------------------------------------
-- 4. Dumping Data for Table `users` (2 records)
-- -----------------------------------------------------------------------------
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`) VALUES
  ('60d2f3b9-e1ca-4257-917c-6d4fcbe14611', 'admin@pahadfootprint.gov.in', '$2a$10$95LNqsvxC5GM/T6yY2QXROhoZeDKJxoSDQ3XFPsLDrBowkvBKrztO', 'admin', '2026-10-22 09:13:25', '2026-10-22 09:13:25'),
  ('37ed8458-5c50-4217-b3c4-7ed2fd00beb1', 'tourist@pahadfootprint.org', '$2a$10$iBVvcUw6HpPFG6gWyvvM8.DyVY7ir07mSaXGl3Vzl5GaTb5f904SO', 'tourist', '2026-10-22 09:13:25', '2026-10-22 09:13:25');
UNLOCK TABLES;

-- -----------------------------------------------------------------------------
-- 5. Dumping Data for Table `trips` (2 records)
-- -----------------------------------------------------------------------------
LOCK TABLES `trips` WRITE;
INSERT INTO `trips` (`id`, `userId`, `routeName`, `distanceKm`, `terrainZone`, `transportMode`, `passengers`, `nights`, `accommodationType`, `perPersonCo2e`, `totalCo2e`, `restorationPledged`, `createdAt`, `updatedAt`) VALUES
  ('f30dc73f-f00d-48aa-b0e5-8d7ce27e0ec7', '60d2f3b9-e1ca-4257-917c-6d4fcbe14611', 'Kumaon Hill Circuit: Kathgodam – Nainital – Mukteshwar – Almora (320 km)', 320, 'mid_hills', 'suv', 3, 4, 'hotel', 55, 165, 0, '2026-10-22 09:55:33', '2026-10-22 09:55:33'),
  ('a38fbe1f-b992-4fe6-968a-9c7430b1e67a', '60d2f3b9-e1ca-4257-917c-6d4fcbe14611', 'Dehradun → Harsil Apple Valley (428 km)', 428, 'high_altitude', 'bus', 45, 14, 'luxury', 349, 15703.9, 0, '2026-10-23 13:28:47', '2026-10-23 13:28:47');
UNLOCK TABLES;

-- -----------------------------------------------------------------------------
-- Restore Environment Variables
-- -----------------------------------------------------------------------------
SET TIME_ZONE=@OLD_TIME_ZONE;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Dump completed on 2026-10-23T16:50:44.189Z
