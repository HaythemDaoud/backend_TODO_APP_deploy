const express = require('express')
const router = express.Router()


const {
  resetPassword,
  editUser,forgot_password,reset_password_get,reset_password_post
} = require('../controllers/profilecontroller')

//const { protect } = require('../middleware/authMiddleware')



router.post('/editus', editUser)

router.post('/resetPwd', resetPassword)

router
.route('/forgot_password')
.post(forgot_password);

router
.route('/reset_password/:email/:token')
.get(reset_password_get);

router
.route('/reset_password/:email/:token')
.post(reset_password_post);





module.exports = router
