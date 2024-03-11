// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Resource-related queries for JS routes.

const db = require('../connection');

/*
Required Queries
 - X Show all resources
 - X Given id, show a specific resource
 - Given all resource fields, add new resource in resources
 - Given all resource fields, update resource in resources
 - Update resource field 'is_archived' to true (archive resource)
*/

/**
 * Get all resources data.
 * @returns {Promise<[{}]>} Promise to resources.
 */
const getResources = () => {
  return db
    .query('SELECT * FROM resources;')
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      console.log(err.message);
      return null;
    });
};

/**
 * Get resources data
 * @param {string} id The id of the user.
 * @returns {Promise<{}>} Promise to the resource.
 */
const getResourceById = (id) => {
  return db
    .query('SELECT * FROM resources WHERE id=$1;', [id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;  // user does not exist
    });
};

/**
 * Add new resource to the database.
 * @param {{name: string, url: string, description: string, owner_id: string, category_id: string, resource_type_id: string, date_added: string}} resource
 * @returns {Promise<{}>} A promise to the resource.
 */
const addNewResource = (resource) => {
  return db
  .query(`INSERT INTO resources (name, url, description, owner_id, category_id, resource_type_id, date_added)
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [resource.name, resource.url, resource.description, resource.owner_id, resource.category_id, resource.resource_type_id, resource.date_added])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    })
};


module.exports = { getResources, getResourceById, addNewResource };
