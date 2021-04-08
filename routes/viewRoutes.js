const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//home page 
router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview);

//tour details page
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

//login page
router.get( '/login', authController.isLoggedIn, viewController.getLoginForm);

//get account
router.get('/me', authController.protect, viewController.getAccount);

//submit data to change
router.post('/submit-user-data', authController.protect, viewController.updateUserData);

//get my tours
router.post('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;