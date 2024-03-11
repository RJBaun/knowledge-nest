// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: Comment-related queries for JS routes.

const db = require('../connection');

/**
 * Get all comments for a specific resource in the database.
 * @param {string} resourceID
 * @returns {Promise<[{}]>} Promise to comments.
 */
const getCommentsByResourceID = (resourceID) => {
  return db.query('SELECT * FROM comments WHERE resource_id = $1;', [resourceID])
    .then(data => {
      return data.rows[0]
    });
};

/**
 * Add a comment to a specific resource in the database.
 * @param {{commenter_id:string, resource_id:string, message:string, post_date:string}} commentObj
 * @returns {Promise<[{}]>} Promise to comments.
 */
const createNewComment = (commentObj) => {
  const { commenter_id, resource_id, message, post_date } = commentObj;
  return db.query('INSERT INTO comments (commenter_id, resource_id, message, post_date) VALUES ($1, $2, $3, $4) RETURNING *;', [commenter_id, resource_id, message, post_date])
    .then(data => {
      return data.rows[0]
    });
};

module.exports = { getCommentsByResourceID, createNewComment };
