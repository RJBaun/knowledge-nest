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
 * @param {{rater_id:string, resource_id:string, rating:string }} ratingObj
 * @returns {Promise<{}|null>} Promise to users.
 */
const createNewRating = (ratingObj) => {
  const { rater_id, resource_id, rating } = ratingObj;
  return db
    .query(`INSERT INTO ratings (rater_id, resource_id, rating)
    VALUES ($1, $2, $3)
    RETURNING *;`, [rater_id, resource_id, rating])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};


/**
 * Checks if unique rating for resource from user (rater) exists.
 * @param {number} rater_id
 * @param {number} resource_id
 * @returns {Promise{}|null} Promise to the like.
 */
const findRatingByRaterIdAndResourceId = (ratingObj) => {
  const { rater_id, resource_id } = ratingObj;

  return db
    .query(`SELECT * FROM ratings
  WHERE rater_id = $1
  AND resource_id = $2;`, [rater_id, resource_id])
    .then(data => {
      if (data.rows[0]) {
        return data.rows[0];
      } else {
        return null;
      }
    });

};

module.exports = { getAverageRatingByResource, createNewRating, findRatingByRaterIdAndResourceId };
