// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: User-related queries for JS routes.

const db = require('../connection');

/**
 * Get all users data.
 * @returns {Promise<[{}]|null>} Promise to users.
 */
const getUsers = () => {
  return db
    .query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get a specific user's data.
 * @param {string} userId ID of a specific user
 * @returns {Promise<{}|null>} Promise to users.
 */
const getUserById = (userId) => {
  return db
    .query(`SELECT * FROM users
    WHERE id = $1;`, [userId])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Add a new user to the database.
 * @param {{username: string, email: string, password: string, date_created: string}} userObj
 * @returns {Promise<{}|null>} Promise to users.
 */
const createNewUser = (userObj) => {
  const { username, email, password } = userObj;
  return db
    .query(`INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [username, email, password])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Update a user's profile in the database.
 * @param {{id: string, username: string, email: string}} userObj
 * @returns {Promise<{}|null>} Promise to users.
 */
const updateUserProfile = (userObj) => {
  const { id, username, email } = userObj;
  return db
    .query(`UPDATE users
    SET username = $2, email = $3
    WHERE id = $1
    RETURNING *;`, [id, username, email])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

///////////////////////////////////
/// From Victoria, Mar 12: I don't think this function will work as expected.
/// Might need to write it something like -> return promise.all(function that 'deletes' user, function that 'archives' resources).then(returns user obj).catch(return null)

/**
 * Delete a user from the database and archive all owned resources.
 * @param {string} userId The ID of a specific user
 * @returns {Promise<{}>} Promise to users.
 */
const deleteUser = (userId) => {
  return db
    .query(`UPDATE users
    SET is_deleted = true
    WHERE id = $1
    RETURNING *;`, [userId])
    .then(data => {
      return data.rows[0];
    })
    .then(() => {
      return db
        .query(`UPDATE resources
        SET is_archived = true
        WHERE owner_id = $1
        RETURNING *;`, [userId]);
    });
};

/**
 * Get all owned resources associated with a user in the database.
 * @param {string} userId The ID of a specific user
 * @returns {Promise<[{}]|null>} Promise to users.
 */
const getOwnedResources = (userId) => {
  return db
    .query(`SELECT * FROM resources
    WHERE owner_id = $1;`, [userId])
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get all liked resources associated with a user in the database.
 * @param {string} userId The ID of a specific user
 * @returns {Promise<[{}]|null>} Promise to user.
 */
const getLikedResources = (userId) => {
  return db
    .query(`SELECT resources.* FROM resources
    JOIN likes ON resources.id = likes.resource_id
    WHERE likes.liker_id = $1;`, [userId])
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

module.exports = { getUsers, getUserById, createNewUser, updateUserProfile, deleteUser, getOwnedResources, getLikedResources };
