/*
 * All routes for Resource Data are defined here
 * Since this file is loaded in server.js into api/resources,
 *   these routes are mounted onto /api/resources
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: All Routes relating to resources are defined here

const express = require('express');
const router  = express.Router();
const resourceQueries = require('../db/queries/resources');
const categoryQueries = require('../db/queries/categories');
const resource_typeQueries = require('../db/queries/resource_types');
const commentQueries = require('../db/queries/comments');

//Route for all resources
router.get('/', (req, res) => {
  resourceQueries.getResources()
    .then(resources => {
      res.send({ resources });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Route for New Resource form
router.get('/new', (req, res) => {
  response = {};
  categoryQueries.getCategories()
    .then(categories => {
      response.categories = categories;
      return resource_typeQueries.getAllResourceTypes();
    })
    .then(resource_types => {
      response.resource_types = resource_types;
      res.send(response);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Get recent resources for homepage
router.get('/recent', (req, res) => {
  resourceQueries.getRecentResources()
    .then(resources => {
      res.send({ resources });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Route for submitting new resource
router.post('/', (req, res) => {
  const resource = req.body;
  resource.owner_id = req.session.user_id;
  categoryQueries.getCategoryIdByName(req.body.category_id)
    .then((category_id) => {
      resource.category_id = category_id.id.toString();
      return resource_typeQueries.getResourceIdByName(req.body.resource_type_id);
    })
    .then((resource_type_id) => {
      resource.resource_type_id = resource_type_id.id.toString();
      return resourceQueries.createNewResource(resource);
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send("Error creating resource: " + err.message);
    });
});


// Route to render a single resource
router.get('/:id', (req, res) => {
  response = {};
  resourceQueries.getResourceById(req.params.id)
  .then((resource) => {
    response.resource = resource;
    return commentQueries.getCommentsByResourceId(req.params.id)
  })
  .then((comments) => {
    response.comments = comments;
    res.send(response);
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
});

// Route for rendering edit resource form
router.get('/:id/edit', (req, res) => {
  response = {};
  resourceQueries.getResourceById(req.params.id)
    .then((resource) => {
    response.resource = resource;
    return categoryQueries.getCategories()
    })
    .then(categories => {
      response.categories = categories;
      return resource_typeQueries.getAllResourceTypes();
    })
    .then(resource_types => {
      response.resource_types = resource_types;
      res.send(response);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Route for rendering delete resource form
router.get('/:id/delete', (req, res) => {
  resourceQueries.getResourceById(req.params.id)
    .then(resource => {
      res.send(resource);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

//Route for updating existing resource
router.post('/:id', (req, res) => {
    const resource = req.body;
    categoryQueries.getCategoryIdByName(req.body.category_id)
      .then((category_id) => {
        resource.category_id = category_id.id.toString();
        return resource_typeQueries.getResourceIdByName(req.body.resource_type_id);
      })
      .then((resource_type_id) => {
        resource.resource_type_id = resource_type_id.id.toString();
        return resourceQueries.updateResource(resource);
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send("Error creating resource: " + err.message);
      });
});

//Route for Archiving/Deleting a resource
router.post('/:id/delete', (req, res) => {
  resourceQueries.archiveResource(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send("Error creating resource: " + err.message);
    });
});

//Route for searching resources
router.get('/search/:query', (req, res) => {
  const search = req.params.query;
  const response = {
    searchValue: req.params.query
  };
  resourceQueries.findResources(search.slice(1))
  .then((resources) => {
    response.resources = resources
    res.send(response)
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
});


module.exports = router;
