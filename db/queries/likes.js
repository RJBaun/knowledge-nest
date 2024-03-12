// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Likes-related queries for JS routes.

const db = require('../connection');

/**
 * Add like to database.
 * @param {string} liker_id ID of user who liked the resource.
 * @param {string} resource_id ID of resource that was liked.
 * @returns {Promise<{}>} Promise to the like.
 */
const createLike = (liker_id, resource_id) => {
  return db
    .query(`INSERT INTO likes (liker_id, resource_id)
  VALUES (${liker_id}, ${resource_id}) RETURNING *;`)
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
 * @returns {Promise<{}>} Promise to the like.
 */
const countLikes = (resource_id) => {
  return db
    .query(`SELECT count(likes.*) FROM LIKES
  RIGHT OUTER JOIN resources ON resource_id = resources.id
  WHERE resources.id = ${resource_id}
  GROUP BY resources.id;
  `)
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

module.exports = { createLike, countLikes };
