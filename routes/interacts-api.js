/*
 * All routes for Interacts Data are defined here, where the user interacts
 * with a resource and data needs to be saved, such as likes, comments, ratings.
 * Since this file is loaded in server.js into api/interacts,
 *   these routes are mounted onto /api/interacts
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

// Created by Rylan Baun
// Created on March 11, 2024
// Purpose: All Routes relating to user interacts

const express = require('express');
const router = express.Router();
const likeQueries = require('../db/queries/likes');


// Save like to likes table
router.post('/like', (req, res) => {
  const likerId = req.session.user_id;
  const resourceId = req.body.resourceId;
  console.log('likerID', likerId, 'resourceID', resourceId);
  if (likerId === undefined) {
    res.send("Log in to 'like' a resource.");
  }
  likeQueries.createNewLike(likerId, resourceId)
    .then(like => {
      console.log(like);
      res.send(like);
    })
    .catch(err => {
      res.status(500);
      res.JSON({ error: err.message });
    });
});




module.exports = router;
