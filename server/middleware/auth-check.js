const jwt = require('jsonwebtoken');
const Users = require('../models').Users;


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('No header!');
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { console.log(err); return res.status(401).end(); }

    const userId = decoded.sub;

    // check if a user exists
    return Users.findById(userId)
          .then((user) => {
            if(!user){
              console.log("user did not exist with id:" + decoded);
              return res.status(401).end();
            }
            return next();
          })
          .catch((err) => {
            return res.status(401).end();
          });
  });
};