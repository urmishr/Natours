const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            require: [true, 'Review can not be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            require: [true, 'review must belongs to a tour'],
        },

        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true, 'review must belongs to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//populate tours and users before find
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name',
    // })
    this.populate({
        path: 'user',
        select: 'name photo _id',
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRatings: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRatings,
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
