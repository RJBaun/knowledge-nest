-- Created by Rylan Baun
-- Created on March 11th, 2024
-- Purpose: DB table to store information about different categories

DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

