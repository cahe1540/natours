//import modules
const express = require('express');
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");

//CREATE ROUTER
const router = express.Router();

/*users routing*/
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

/*password recovery*/
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


/*update password*/
router.patch('/updatePassword', authController.protect, authController.updatePassword);

//ALL ROUTES BEYOND THIS POINT ARE PROTECTED
router.use(authController.protect);

/*get self's data*/
router.get('/me', userController.getMe, userController.getUser);

/*make updates to non password fields of user*/
router.patch('/updateMe', 
    userController.uploadUserPhoto,
    userController.resizeUserPhoto, 
    userController.updateMe);

/* deactivate account */
router.delete('/deleteMe', userController.deleteMe);

//get all users
router
    .route('/')
    .get(authController.restrictTo('admin'), userController.getAllUsers);

//get, update, and delete a user, ADMIN only
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

//export
module.exports = router;