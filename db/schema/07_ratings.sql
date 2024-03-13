-- Created by Rylan Baun
-- Created on March 11th, 2024
-- Purpose: DB table to store information about different ratings

DROP TABLE IF EXISTS ratings CASCADE;

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  rater_id INTEGER REFERENCES users(id) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) NOT NULL,
  rating SMALLINT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


