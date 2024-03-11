-- Drop and recreate resources table
DROP TABLE IF EXISTS likes CASCADE;

-- Created by Victoria Lane
-- Created on March 11, 2024
-- Purpose: DB table to store likes data

CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  liker_id INTEGER REFERENCES users(id),
  resource_id INTEGER REFERENCES resources(id),
  date TIMESTAMP
);
