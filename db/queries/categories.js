// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Categories-related queries for JS routes.
  // Edited March 12th by Rylan Baun - Add Get category ID function

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

/**
 * Get category ID by name.
 * @returns {Promise<{}|null>} Promise to categories.
 */
const getCategoryIdByName = (name) => {
  return db.query('SELECT id FROM categories WHERE name = $1;', [name])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};



module.exports = { getCategories, getCategoryIdByName };
