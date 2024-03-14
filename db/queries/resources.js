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
    .query(`SELECT resources.*, users.username AS owner_name, resource_types.icon_link, categories.name AS category_name, likes_count.count_likes AS count_likes, ratings_avg.avg_rating AS avg_rating FROM resources
    JOIN resource_types ON resource_types.id = resources.resource_type_id
    JOIN categories ON categories.id = resources.category_id
    LEFT JOIN users ON resources.owner_id = users.id
    LEFT JOIN (
      SELECT resource_id, COUNT(*) AS count_likes FROM likes
      GROUP BY resource_id
      ) AS likes_count ON resources.id = likes_count.resource_id
    LEFT JOIN (
      SELECT resource_id, ROUND(AVG(rating), 1) AS avg_rating FROM ratings
      GROUP BY resource_id
      ) AS ratings_avg ON resources.id = ratings_avg.resource_id
    WHERE resources.is_archived = false
    GROUP BY resources.id, resource_types.icon_link, categories.name, users.username, likes_count.count_likes, ratings_avg.avg_rating
    ORDER BY date_added;`)
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};


/**
 * Get all owned resources data for a specific user
 * @returns {Promise<[{}]|null>} Promise to resources.
*/
const getResourcesByUser = (id) => {
  return db
    .query(`SELECT resources.*, resource_types.icon_link, categories.name AS category_name, count(likes.*) AS count_likes, round(avg(ratings.rating), 1) AS avg_rating FROM resources
    JOIN resource_types ON resource_types.id = resources.resource_type_id
    JOIN categories ON categories.id = resources.category_id
    LEFT JOIN likes ON resources.id = likes.resource_id
    LEFT JOIN ratings ON resources.id = ratings.resource_id
    WHERE resources.is_archived = false
    AND owner_id = $1
    GROUP BY resources.id, resource_types.icon_link, categories.name
    ORDER BY date_added;`, [id])
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get all liked resources data for a specific user
 * @returns {Promise<[{}]|null>} Promise to resources.
*/
const getResourcesByLiker = (id) => {
  return db
    .query(`SELECT resources.*, resource_types.icon_link, categories.name AS category_name, count(likes.*) AS count_likes, round(avg(ratings.rating), 1) AS avg_rating FROM resources
    JOIN resource_types ON resource_types.id = resources.resource_type_id
    JOIN categories ON categories.id = resources.category_id
    LEFT JOIN likes ON resources.id = likes.resource_id
    LEFT JOIN ratings ON resources.id = ratings.resource_id
    WHERE resources.is_archived = false
    AND liker_id = $1
    GROUP BY resources.id, resource_types.icon_link, categories.name
    ORDER BY date_added;`, [id])
    .then(data => {
      return data.rows;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Get resource's data
 * @param {string} id The id of the user.
 * @returns {Promise<{}|null>} Promise to the resource.
 */
const getResourceById = (id) => {
  return db
    .query(`SELECT resources.*, users.username AS owner_name, resource_types.icon_link, categories.name AS category_name, count(likes.*) AS count_likes, round(avg(ratings.rating), 1) AS avg_rating FROM resources
    JOIN resource_types ON resource_types.id = resources.resource_type_id
    JOIN categories ON categories.id = resources.category_id
    LEFT JOIN users ON resources.owner_id = users.id
    LEFT JOIN likes ON resources.id = likes.resource_id
    LEFT JOIN ratings ON resources.id = ratings.resource_id
    WHERE resources.id=$1
    GROUP BY resources.id, resources.name, resources.url, resources.description, resources.owner_id, resources.category_id, resources.resource_type_id, resources.date_added, users.username, resource_types.icon_link, categories.name;`, [id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;  // user does not exist
    });
};

/**
 * Add new resource to the database.
 * @param {{name: string, url: string, description: string, owner_id: string, category_id: string, resource_type_id: string}} resource
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const createNewResource = (resource) => {
  console.log(resource.name, resource.url, resource.description, resource.owner_id, resource.category_id, resource.resource_type_id)
  return db
    .query(`INSERT INTO resources (name, url, description, owner_id, category_id, resource_type_id)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [resource.name, resource.url, resource.description, resource.owner_id, resource.category_id, resource.resource_type_id])
    .then(data => {
      return data.rows[0];
    })
    .catch(err => {
      return null;
    });
};

/**
 * Update single resource in the database.
 * @param {{id: string, name: string, description: string, category_id: string, resource_type_id: string}} resource
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const updateResource = (resource) => {
  console.log(resource)
  return db
    .query(`UPDATE resources
    SET name=$1, description=$2, category_id=$3, resource_type_id=$4
    WHERE id=$5 RETURNING *;`, [resource.name, resource.description, resource.category_id, resource.resource_type_id, resource.id])
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
 * Archive resource in the database by owner_id.
 * @param {string} ownerId
 * @returns {Promise<{}|null>} A promise to the resource.
 */
const archiveResourceByOwnerId = (ownerId) => {
  return db
    .query(`UPDATE resources
    SET is_archived=true
    WHERE owner_id=$1;`, [ownerId])
    .then(() => {
      return;
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

module.exports = { getResources, getResourceById, createNewResource, updateResource, archiveResource, getRecentResources, archiveResourceByOwnerId, getResourcesByUser, getResourcesByLiker };
