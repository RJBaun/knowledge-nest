/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/users');
const resourceQueries = require('../db/queries/resources');
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
        res.json(null);
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
});


router.get('/id', (req, res) => {
  const user_id = req.session.user_id;
  userQueries.getUserById(user_id)
    .then(user => {
      if (!user) {
        res.json(null);
      } else {
        res.json({ user });
      }
    })
    .catch(err => {
      res.json(null);
    });
});

router.post('/id/edit', (req, res) => {
  const id = req.session.user_id;
  const { username, email } = req.body;
  const userData = { id, username, email };
  console.log('before',userData);
  userQueries.updateUserProfile(userData)
    .then(user => {
      console.log('after',user);
      res.json({ user });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/id/delete', (req, res) => {
  const id = req.session.user_id;
  userQueries.deleteUser(id)
    .then(user => {
      console.log('deleted api side', user);
      resourceQueries.archiveResourceByOwnerId(user.id)
      req.session = null;
      res.json({ user });
    })
    .catch(err => {
      console.log(err);
    })
});



module.exports = router;

