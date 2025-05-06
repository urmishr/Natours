// const AppError = require('./../utils/appErrors');
// const catchAsync = require('./../utils/catchAsync');

const Booking = require('../model/bookingModel');

const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../model/reviewModel');
const factoryController = require('./handlerFactory');

exports.setTourAndUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.checkReviewConditions = catchAsync(async (req, res, next) => {
    const { tour, review, rating } = req.body;

    if (!req.user)
        return next(new AppError('Please login to review the tour', 403));
    const { id } = req.user;

    if (!tour || !id || !review || !rating)
        return next(
            new AppError(
                'All fields are required: tour, user, review, rating',
                400,
            ),
        );

    const bookingExists = await Booking.exists({ user: id, tour: tour });
    if (!bookingExists) {
        throw new AppError('You must book the tour before reviewing it', 403);
    }

    const reviews = await Review.find({ tour: tour, user: id });

    if (reviews.length > 0)
        return next(new AppError('You have already reviewed the tour!', 409));

    next();
});

exports.getReviewByUserId = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError('Please login to review the tour', 403));
    const { id } = req.user;

    const reviews = await Review.find({ user: { _id: id } }).populate({
        path: 'tour',
        select: '_id imageCover name -guides',
    });
    if (!reviews)
        return next(new AppError('No review found for this user!', 404));
    res.status(201).json({
        status: 'success',
        results: reviews.length,
        message: `reviews found for user ${id}`,
        reviews,
    });
});

exports.getAllReviews = factoryController.getAll(Review);
exports.deleteReview = factoryController.deleteOne(Review);
exports.updateReview = factoryController.updateOne(Review);
exports.createReview = factoryController.createOne(Review);
exports.getReviewById = factoryController.getOne(Review);
