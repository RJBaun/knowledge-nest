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

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('email', email);
  userQueries.getUserByEmail(email)
    .then(user => {

      if (bcrypt.compareSync(password, user.password)) {
        // console.log('passwords match');
        req.session.user_id = user.id;
        res.json({ user });
      } else {
        // console.log('passwords do not match');
        res.json(null)
      }
    })
    .catch(err => {
      res.json('email');
    });



  // console.log('user', user);
  // bcrypt.compare(password, user.password, (err, res) => {
  //   if (err) {
  //     console.log('err password compare');
  //   }
  //   if (res) {
  //     console.log('passwords match');
  //   } else {
  //     console.log('passwords do not match');
  //   }

  // console.log('user',user);
  // // req.session.user_id = user.id;

});

module.exports = router;

