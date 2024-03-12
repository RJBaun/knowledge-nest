-- Drop and recreate resources table
DROP TABLE IF EXISTS resources CASCADE;

-- Created by Victoria Lane
-- Created on March 11, 2024
-- Purpose: DB table to store resources data

CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description VARCHAR(255),
  owner_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  resource_type_id INTEGER REFERENCES resource_types(id),
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_archived BOOLEAN DEFAULT false
);
