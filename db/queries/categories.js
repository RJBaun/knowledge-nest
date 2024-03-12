// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Categories-related queries for JS routes.

const db = require('../connection');
/**
 * Get all categories.
 * @returns {Promise<[{}]|null>} Promise to categories.
 */
const getCategories = () => {
  return db.query('SELECT * FROM categories;')
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

module.exports = { getCategories };
