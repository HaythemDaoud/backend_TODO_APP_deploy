const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

/*const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, "hey123hgert")

      // Get user from the token
      //let user = await User.findById(decoded.id).select('-password')
      let user = await User.findById(decoded.id);
      //res.locals.user = user;
      //req.user = user;
      req.userData=user;
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})*/

const protect = (req, res, next) => {
  //TODO: CHANGE FROM COOKIE TO HEADER WHEN MOVING TO ANDROID
  //const token = req.cookies.jwt;
  const token = req.headers['jwt']

  if (token) {
      jwt.verify(token, 'hey123hgert', async (err, decodedToken) => {
          if (err) {
              res.status(400).send({"message": err.message});
          } else {
              let user = await User.findById(decodedToken.id);
              res.locals.user = user;
              req.userData = user;
              next();
          }
      });
  } else {
      console.log('No token');
      res.status(400).send({"message": "not authorized"});
  }
};



module.exports = { protect }
