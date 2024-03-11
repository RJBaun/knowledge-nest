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
 * Get all resources data
 * @returns Promise which returns array of object of all resources data
 */
const getResources = () => {
  return db.query('SELECT * FROM resources;')
  .then(data => {
    return data.rows;
  });
}





module.exports = { getResources };
