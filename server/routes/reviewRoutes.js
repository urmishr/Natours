const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.get(
    '/user',
    authController.restrictTo('user', 'admin'),
    reviewController.getReviewByUserId,
);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourAndUserId,
        reviewController.checkReviewConditions,
        reviewController.createReview,
    );

router
    .route('/:id')
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview,
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview,
    )
    .get(reviewController.getReviewById);

module.exports = router;
