const express = require('express')
const router = express.Router()


const {
  createproject,
  getProjects
 
} = require('../controllers/projectcontroller')

const { protectgroup } = require('../middleware/authMiddlewaregroup')


router.post('/createproject' ,createproject)
router.post('/getProject',getProjects)







module.exports = router
