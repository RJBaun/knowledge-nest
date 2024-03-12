/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/users');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Save new user data to users table, return new user data.
router.post('/', (req, res) => {
  userQueries.createNewUser(req.body)
    .then(user => {
      req.session.user_id = user.id;
      res.json({ user });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Checks if login details match users table, then logs in user if match.
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('email', email);
  userQueries.getUserByEmail(email)
    .then(user => {

      if (bcrypt.compareSync(password, user.password)) {
        // passwords match
        req.session.user_id = user.id;
        res.json({ user });
      } else {
        // passwords do not match
        res.json(null)
      }
    })
    .catch(err => {
      // email does not exist in users database
      res.json('email');
    });
});


// Logs user out.
router.get('/logout', (req, res) => {
  // delete cookies
  req.session = null;
  res.json(null);
})

module.exports = router;

