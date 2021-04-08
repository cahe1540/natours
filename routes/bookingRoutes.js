const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
    '/checkout-session/:tourId', 
    authController.protect, 
    bookingController.getCheckoutSession);

//create, getting, updating, only for admins
router.use(authController.restrictTo('admin'));

//get all
router
    .route('/')
    .post(bookingController.createBooking)
    .get(bookingController.getAllBookings);

//get one by id
router
    .route('/:bookingId')
    .get(bookingController.getBooking);

//updating
router
    .route('/:bookingId')
    .patch(bookingController.updateBooking);

//deleting
router
    .route(':bookingId')
    .delete(bookingController.deleteBooking);

module.exports = router;
