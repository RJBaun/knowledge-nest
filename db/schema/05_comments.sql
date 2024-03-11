-- Created by Rylan Baun
-- Created on March 11th, 2024
-- Purpose: DB table to store information about different comments

DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  commenter_id INTEGER REFERENCES users(id) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) NOT NULL,
  message TEXT NOT NULL,
  post_date TIMESTAMP NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);
