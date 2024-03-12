-- Drop and recreate Users table
DROP TABLE IF EXISTS users CASCADE;

-- Created by Victoria Lane
-- Created on March 11, 2024
-- Purpose: DB table to store user data

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);
