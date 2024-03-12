// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: Ratings-related queries for JS routes.

const db = require('../connection');

/**
 * Get average rating for a specific resource in the database.
 * @param {string} resourceID the ID of a specific resource
 * @returns {Promise<{}|null>} Promise to users.
 */
const getAverageRatingByResource = (resourceID) => {
  return db
    .query(`SELECT round(avg(rating),1) FROM ratings
    WHERE resource_id = $1;`, [resourceID])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Insert new rating into the database.
 * @param {{rater_id:string, resource_id:string, rating:string, date:string}} ratingObj
 * @returns {Promise<{}|null>} Promise to users.
 */
const createNewRating = (ratingObj) => {
  const { rater_id, resource_id, rating, date } = ratingObj;
  return db
    .query(`INSERT INTO ratings (rater_id, resource_id, rating, date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`, [rater_id, resource_id, rating, date])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

module.exports = { getAverageRatingByResource, createNewRating };
