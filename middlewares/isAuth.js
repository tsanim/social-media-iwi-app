const env = process.env.NODE_ENV || 'development';

const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config')[env].JWT_SECRET;

module.exports = (req, res, next) => {
    //get request header for authorization
    const authHeaders = req.get('Authorization');

    //if there is no header return message 
    if (!authHeaders) {
      return res.status(401)
        .json({ message: 'Not authenticated.' })
    }
  
    //if there is header, then we have token from it
    const token = req.get('Authorization').split(' ')[1];

    //init decodedToken
    let decodedToken;

    try {
      //verify token from header so we can see if user is authenticated
      decodedToken = jwt.verify(token, jwtSecret);
    } catch(error) {
      return res.status(401)
        .json({ message: 'Token is invalid.', error });
    }
  
    //if verified token is undefined or null then we send message that user is not athenticated
    if (!decodedToken) {
      return res.status(401)
        .json({ message: 'Not authenticated.' });
    }
  
    //set user id to req from decoded token
    req.userId = decodedToken.userId;
    next();
  }