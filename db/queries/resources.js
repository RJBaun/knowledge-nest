// Created by Victoria Lane
// Created on March 11, 2024
// Purpose: Resource-related queries for JS routes.

const db = require('../connection');

/**
 * Get all resources data.
 * @returns {Promise<[{}]|null>} Promise to resources.
*/
const getResources = () => {
  return db
    .query(`SELECT resources.*, resource_types.icon_link, categories.name AS category_name, count(likes.*) AS count_likes, round(avg(ratings.rating), 1) AS avg_rating FROM resources
    JOIN resource_types ON resource_types.id = resources.resource_type_id
    JOIN categories ON categories.id = resources.category_id
    LEFT JOIN likes ON resources.id = likes.resource_id
    LEFT JOIN ratings ON resources.id = ratings.resource_id
    GROUP BY resources.id, resource_types.icon_link, categories.name;`)
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get resources data
 * @param {string} id The id of the user.
 * @returns {Promise<{}|null>} Promise to the resource.
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
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const createNewResource = (resource) => {
  return db
    .query(`INSERT INTO resources (name, url, description, owner_id, category_id, resource_type_id, date_added)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`, [resource.name, resource.url, resource.description, resource.owner_id, resource.category_id, resource.resource_type_id, resource.date_added])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Update single resource in the database.
 * @param {{id: string, name: string, url: string, description: string, owner_id: string, category_id: string, resource_type_id: string, date_added: string}} resource
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const updateResource = (resource) => {
  return db
    .query(`UPDATE resources
    SET name=$1, url=$2, description=$3, owner_id=$4, category_id=$5, resource_type_id=$6, string=$7
    WHERE id=$8 RETURNING *;`, [resource.name, resource.url, resource.description, resource.owner_id, resource.category_id, resource.resource_type_id, resource.date_added, resource.id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Archive resource in the database.
 * @param {string} id Resource id.
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const archiveResource = (id) => {
  return db
    .query(`UPDATE resources
    SET is_archived=true
    WHERE id=$1 RETURNING *;`, [id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get # of queries, based on criteria
 * @param {number} limit (optional) max number of entries to return, default 10.
 * @return {Promise<[{}]|null>} A promise to resources
 */
const getRecentResources = (limit = 10) => {
  return db
    .query(`SELECT * FROM resources
    ORDER BY date_added DESC
    LIMIT $1`, [limit])
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

module.exports = { getResources, getResourceById, createNewResource, updateResource, archiveResource, getRecentResources };
