-- SultraKita modernization schema
-- Target: MySQL 8+; PostgreSQL adaptation is documented in the migration README.

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  role ENUM('buyer','seller','admin','mitra_umkm') NOT NULL DEFAULT 'buyer',
  district VARCHAR(80) NOT NULL DEFAULT 'Kendari',
  province VARCHAR(80) NOT NULL DEFAULT 'Sulawesi Tenggara',
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_district (role, district),
  INDEX idx_users_verified (phone_verified)
);

CREATE TABLE listings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  seller_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  condition_label VARCHAR(32) NOT NULL DEFAULT 'new',
  status ENUM('draft','active','archived','sold','blocked') NOT NULL DEFAULT 'draft',
  district VARCHAR(80) NOT NULL DEFAULT 'Kendari',
  city VARCHAR(80) NOT NULL DEFAULT 'Kendari',
  province VARCHAR(80) NOT NULL DEFAULT 'Sulawesi Tenggara',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users(id),
  INDEX idx_listings_filter (status, district, category_id, price, created_at),
  INDEX idx_listings_seller_status (seller_id, status, updated_at),
  FULLTEXT INDEX ftx_listings_search (title, description)
);

CREATE TABLE videos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  listing_id BIGINT UNSIGNED NOT NULL,
  provider ENUM('upload','youtube','tiktok') NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  duration_seconds INT UNSIGNED NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_videos_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  INDEX idx_videos_listing_order (listing_id, sort_order)
);

CREATE TABLE social_links (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  platform ENUM('facebook','tiktok','youtube') NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_social_links_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_social_user_platform (user_id, platform)
);

-- PostgreSQL notes:
-- Replace AUTO_INCREMENT with GENERATED ALWAYS AS IDENTITY, BIGINT UNSIGNED with BIGINT,
-- ENUM with a CHECK constraint, and FULLTEXT INDEX with a tsvector/GIN index.
