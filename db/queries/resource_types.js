// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: Resource_types related queries for JS routes.

const db = require('../connection');

/**
 * Get all resource_types names from database.
 * @returns {Promise<[{}] | null>} Promise to users.
 */
const getAllResourceTypes = () => {
  return db
    .query('SELECT * FROM resource_types')
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get all resource_types names from database.
 * @returns {Promise<{} | null>} Promise to users.
 */
const getResourceIdByName = (name) => {
  return db
    .query('SELECT id FROM resource_types WHERE name = $1;', [name])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

module.exports = { getAllResourceTypes, getResourceIdByName };
