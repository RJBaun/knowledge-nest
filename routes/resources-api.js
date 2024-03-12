// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: All Routes relating to resources are defined here

const express = require('express');
const router  = express.Router();
const resourceQueries = require('../db/queries/resources');

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

module.exports = router;
