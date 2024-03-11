// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: User-related queries for JS routes.

const db = require('../connection');

/**
 * Get all users data.
 * @returns {Promise<[{}]>} Promise to users.
 */
const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

/**
 * Get specific user data.
 * @param {string} userID
 * @returns {Promise<{}>} Promise to users.
 */
const getUserByID = (userID) => {
  return db.query('SELECT * FROM users WHERE id = $1;', [userID])
    .then(data => {
      return data.rows[0]
    })
    .catch(err => {
      return null;
    })
};

/**
 * Insert new user to the database.
 * @param {{username:string, email:string, password:string, date_created:string}} userObj
 * @returns {Promise<{}>} Promise to users.
 */
const createNewUser = (userObj) => {
  const { username, email, password, date_created } = userObj;
  return db.query('INSERT INTO users (username, email, password, date_created) VALUES ($1, $2, $3, $4) RETURNING *;', [username, email, password, date_created])
    .then(data => {
      return data.rows[0]
    });
};

/**
 * Update a users profile in the database.
 * @param {{id:string, username:string, email:string}} userObj
 * @returns {Promise<{}>} Promise to users.
 */
const editUserProfile = (userObj) => {
  const { id, username, email } = userObj;
  return db.query('UPDATE users SET username = $2, email = $3 WHERE id = $1 RETURNING *;', [id, username, email])
    .then(data => {
      return data.rows[0]
    });
};

/**
 * Delete a user from the database and archive all owned resources.
 * @param {{id:string}} userObj
 * @returns {Promise<{}>} Promise to users.
 */
const deleteUser = (userObj) => {
  const { id } = userObj;
  return db.query('UPDATE users SET is_deleted = true WHERE id = $1 RETURNING *;', [id])
    .then(data => {
      return data.rows[0]
    })
    .then(() => {
      return db.query('UPDATE resources SET is_archived = true WHERE owner_id = $1 RETURNING *;', [id])
    });
};;

/**
 * Get all resources associated with a user in the database.
 * @param {{id:string}} userObj
 * @returns {Promise<[{}]>} Promise to users.
 */
const getOwnedResources = (userObj) => {
  const { id } = userObj;
  return db.query('SELECT * FROM resources WHERE owner_id = $1;', [id])
    .then(data => {
      return data.rows
    });
};

/**
 * Get all resources associated with a user in the database.
 * @param {{id:string}} userObj
 * @returns {Promise<[{}]>} Promise to users.
 */
const getLikedResources = (userObj) => {
  const { id } = userObj;
  return db.query('SELECT resources.* FROM resources JOIN likes ON resources.id = likes.resource_id WHERE likes.liker_id = $1;', [id])
    .then(data => {
      return data.rows
    });
};

module.exports = { getUsers, getUserByID, createNewUser, editUserProfile, deleteUser, getOwnedResources, getLikedResources };
