const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Group = require('../models/groupModel')

const protectgroup = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) 
   {

    try {

      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, "arGTRFD125L")

      // Get group from the token
      //let group = await User.findById(decoded.id).select('-password')
      let group = await Group.findById(decoded.id);
      
     
      //res.locals.group = group
      req.groupData = group
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }

   }
  })

 




module.exports = { protectgroup }
