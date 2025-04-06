const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
// const { authenticate } = require('../middleware/authMiddleware');


router.route('/signup').post(userController.signUp)
router.route('/login').post(userController.logIn)
router.route('/logout').get(userController.logOut)
router.route('/forgotpassword').post(userController.forgotPassword)
router.route('/resetpassword/:token').patch(userController.resetPassword)
router.route('/').get(userController.getAllUsers)
router.route('/:id').get(userController.getUser).delete(userController.deleteUser)


module.exports = router;