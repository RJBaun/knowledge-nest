// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Likes-related queries for JS routes.

const db = require('../connection');

/**
 * Add like to database.
 * @param {string} liker_id ID of user who liked the resource.
 * @param {string} resource_id ID of resource that was liked.
 * @returns {Promise<{}|null>} Promise to the like.
 */
const createNewLike = (liker_id, resource_id) => {
  return db
    .query(`INSERT INTO likes (liker_id, resource_id)
  VALUES ($1, $2)
  RETURNING *;`, [liker_id, resource_id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Count likes for specific resource.
 * @param {string} resource_id ID of specific resource.
 * @returns {Promise<{}|null>} Promise to the like.
 */
const countLikes = (resource_id) => {
  return db
    .query(`SELECT count(likes.*) FROM LIKES
  RIGHT OUTER JOIN resources ON resource_id = resources.id
  WHERE resources.id = $1
  GROUP BY resources.id;`, [resource_id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Checks if unique like for resource from user (liker) exists.
 * @param {string} liker_id
 * @param {string} resource_id
 * @returns {Promise{}|null} Promise to the like.
 */
const findLikeByLikerIdAndResourceId = (liker_id, resource_id) => {
  return db
    .query(`SELECT * FROM likes
  WHERE liker_id = $1
  AND resource_id = $2;`, [liker_id, resource_id])
    .then(data => {
      console.log(data.rows[0]);
      if (data.rows[0]) {
        return data.rows[0];
      } else {
        return null;
      }
    });

};

module.exports = { createNewLike, countLikes, findLikeByLikerIdAndResourceId };
