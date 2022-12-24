const express = require('express')
const router = express.Router()


const {
  creategroup,
  updateEmail,
 
  getGroups,
  deleteGroup,
 
} = require('../controllers/groupController')

const { protect } = require('../middleware/authMiddleware')


router.post('/creategroup', protect,  creategroup)
router.get('/getgroups',protect,  getGroups)
router.patch('/updateEmail/:id', updateEmail)
//router.patch('/updateNameGroup/:id', updateNameGroup)
//router.patch('/updateGroup/:id', updateGroup)
router.delete('/deleteGroup/:id', deleteGroup)







module.exports = router
