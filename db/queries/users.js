const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

getUserByID = (userID) => {
  return db.query('SELECT * FROM users WHERE id = $1', [userID])
    .then(data => {
      return data.rows[0]
    });
};

createNewUser = (userObj) => {
  const { username, email, password, date_created } = userObj;
  return db.query('INSERT INTO users (username, email, password, date_created) VALUES ($1, $2, $3, $4);', [username, email, password, date_created])
    .then(data => {
      return data.rows[0]
    });
};

module.exports = { getUsers };
