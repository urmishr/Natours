const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController');
const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.get('/user/:userId', bookingController.getBookingByUserId);
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(bookingController.getBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
