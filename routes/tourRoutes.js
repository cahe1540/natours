//import modules
const express = require('express');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// eslint-disable-next-line import/no-dynamic-require
const tourController = require(`${__dirname}/../controllers/tourController`);

//creat a route
const router = express.Router();

/*tours routing*/
router 
    .route('/top-5-cheap')
    .get(
        tourController.aliasTopTours, 
        tourController.getAllTours);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourController.getMonthlyPlan);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.deleteTour);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router
    .route('/distances/:latlng/:unit')
    .get(tourController.distances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.createNewTour);

router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
