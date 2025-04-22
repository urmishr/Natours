const Tour = require('../model/tourModel');
const AppError = require('./../utils/appErrors');
const catchAsync = require('./../utils/catchAsync');
const factoryController = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                'Uploaded file is not an image type. Please use only images',
                400,
            ),
            false,
        );
    }
};
const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadTourImages = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 3,
    },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.images || !req.files.imageCover) return next();

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    req.body.images = [];
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    const images = req.files.images.map(async (image, i) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(image.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${fileName}`);
        req.body.images.push(fileName);
    });

    await Promise.all(images);

    next();
});

exports.getAllTours = factoryController.getAll(Tour);
exports.getTourById = factoryController.getOne(Tour, { path: 'reviews' });
exports.createTour = factoryController.createOne(Tour);
exports.updateTour = factoryController.updateOne(Tour);
exports.deleteTour = factoryController.deleteOne(Tour);

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: '$difficulty',
                numOfTours: { $sum: 1 },
                numOfRatings: { $sum: '$ratingsQuantity' },
                averageRatings: { $avg: '$ratingsAverage' },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { averagePrice: 1 },
        },
        // { $match: { _id: { $ne: 'easy' } } },
    ]);
    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    if (year.toString().length < 4)
        return next(new AppError(`Invalid Year: Must be 4 digits`, 404));

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numOfTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        { $sort: { numOfTourStarts: -1 } },
    ]);
    if (plan.length === 0) {
        return next(
            new AppError(`No plan available for the year ${year}`, 404),
        );
    }
    res.status(200).json({
        status: 'success',
        data: { plan },
    });
});

exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const radius = unit === 'km' ? distance / 6378 : distance / 3963;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng)
        return new AppError('Lat and Lng is required! format: lat,lng');

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(201).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.0006213712 : 0.001;

    if (!lat || !lng)
        return new AppError('Lat and Lng is required! format: lat,lng');

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);
    res.status(201).json({
        status: 'success',
        data: {
            distances,
        },
    });
});
