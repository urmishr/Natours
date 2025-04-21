const Booking = require('../model/bookingModel');
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../model/tourModel');
const AppError = require('./../utils/appErrors');

exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        tours,
    });
});

exports.getTourOverview = catchAsync(async (req, res, next) => {
    const { tourSlug } = req.params;

    const tour = await Tour.findOne({ slug: tourSlug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) return next(new AppError('No tours found with that name', 404));
    res.status(200).render('tour', {
        title: tour.name,
        tour,
    });
});
exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id });

    const tourIds = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });
    res.status(200).render('overview', {
        title: 'My Bookings',
        tours,
    });
});

exports.loginUser = catchAsync(async (req, res, next) => {
    res.status(201).render('login', {
        title: 'Login to your account',
    });
});

exports.account = (req, res) => {
    res.status(201).render('account', {
        title: 'Account Settings',
    });
};
