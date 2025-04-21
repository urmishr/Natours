// const AppError = require('./../utils/appErrors');
// const catchAsync = require('./../utils/catchAsync');
const Review = require('./../model/reviewModel');
const factoryController = require('./handlerFactory');

exports.getAllReviews = factoryController.getAll(Review);
// catchAsync(async (req, res, next) => {
//     let filter;
//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const reviews = await Review.find(filter);

//     if (reviews.length === 0)
//         return next(new AppError('No reviews found', 404));

//     res.status(201).json({
//         status: 'success',
//         reviews: reviews.length,
//         data: {
//             reviews,
//         },
//     });
// });

exports.setTourAndUserId = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.deleteReview = factoryController.deleteOne(Review);
exports.updateReview = factoryController.updateOne(Review);
exports.createReview = factoryController.createOne(Review);
exports.getReviewById = factoryController.getOne(Review);
