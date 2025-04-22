const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [30, 'Name must be no longer than 30 characters'],
            minlength: [5, 'Name must be no longer than 30 characters'],
        },
        duration: {
            type: Number,
            required: [true, 'Tour must have a durations'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'Tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'Tour must have a difficalty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty Must be : easy , medium , difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Ratings must be between 1.0 to 5.0'],
            max: [5, 'Ratings must be between 1.0 to 5.0'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'discout price {{VALUE}} must be lower than price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Tour must have summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'Tour must have image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date],
        slug: String,
        secretTour: { type: Boolean, default: false },
        startLocation: {
            //GeoJson
            type: {
                type: String,
                default: 'Point', //or line or polygon
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point', //or line or polygon
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

//setting indexing
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//virtual property
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//tour reviews virtual property
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// document midddleware runs before save or create command
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

//Example :  embeded guides in tour schema
//guides type should be an array => guides: Array,
// tourSchema.pre('save', async function (next) {
//     const guidePromises = this.guides.map(
//         async (guide) => await User.findById(guide),
//     );

//     this.guides = await Promise.all(guidePromises);
//     next();
// });

//query middleware
tourSchema.pre(/^find/, function (next) {
    // tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: ['name', 'email', 'photo', 'role'],
    });

    next();
});

//aggregatino middlware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
