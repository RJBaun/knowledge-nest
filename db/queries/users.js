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

editUserProfile = (userObj) => {
  const { id, username, email } = userObj;
  return db.query('UPDATE users SET username = $2, email = $2 WHERE id = $1', [id, username, email])
    .then(data => {
      return data.rows[0]
    });
};

deleteUser = (userObj) => {
  const { id } = userObj;
  return db.query('UPDATE users SET is_deleted = true WHERE id = $1', [id])
    .then(data => {
      return data.rows[0]
    })
    .then(() => {
      return db.query('UPDATE resources SET is_archived = true WHERE owner_id = $1', [id])
    });
};;

getUserResources = userObj => {
  const { id } = userObj;
  return db.query('SELECT * FROM resources WHERE owner_id = $1 UNION SELECT resources.* FROM resources JOIN likes ON resources.id = likes.resource_id WHERE liker_id = $1', [id])
    .then(data => {
      return data.rows
    });
};

module.exports = { getUsers, getUserByID, createNewUser, editUserProfile, deleteUser, getUserResources };
