-- Created by Rylan Baun
-- Created on March 11th, 2024
-- Purpose: DB table to store information about different resource types

DROP TABLE IF EXISTS resource_types CASCADE;

CREATE TABLE resource_types (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_link TEXT NOT NULL
);
