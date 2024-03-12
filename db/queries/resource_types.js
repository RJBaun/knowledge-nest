// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: Resource_types related queries for JS routes.

const db = require('../connection');

/**
 * Get all resource_types names from database.
 * @returns {Promise<[{}]>} Promise to users.
 */
const getAllResourceTypes = () => {
  return db.query('SELECT name FROM resource_types')
    .then(data => {
      return data.rows
    });
};
