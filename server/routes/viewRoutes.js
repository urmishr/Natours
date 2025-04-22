const express = require('express');
const viewController = require('./../controller/viewController');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');

const router = express.Router();

router.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview,
);

router.get(
    '/tour/:tourSlug',
    authController.isLoggedIn,
    viewController.getTourOverview,
);

router.get('/login', authController.isLoggedIn, viewController.loginUser);

router.get('/me', authController.protect, viewController.account);
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
