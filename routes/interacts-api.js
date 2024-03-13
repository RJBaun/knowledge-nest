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


/////////////////////////////////////
// POST - from click on 'like' button
//   -- Checks if user:
//      -- is logged in (if not, returns message back to user)
//      -- has liked the resource (if so, returns status 401)
//   -- Then saves like to likes table

router.post('/like', (req, res) => {
  const likerId = req.session.user_id;
  const resourceId = req.body.resourceId;

  // if user not logged in, cannot like resource
  if (likerId === undefined) {
    res.status(401);
    res.send("Log in to 'like' a resource.");
  }

  // if user has already liked resource, cannot like again
  likeQueries.findLikeByLikerIdAndResourceId(likerId, resourceId)
    .then(like => {
      if (like !== null) {
        res.status(401);
        res.send('You cannot like a resource more than once.');
      } else {
        likeQueries.createNewLike(likerId, resourceId)
          .then(like => {
            res.send(like);
          });
      }
    })
    .catch(err => {
      res.status(500);
      res.JSON({ error: err.message });
    });
});




module.exports = router;
