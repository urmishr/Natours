const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        require: [true, 'Booking must belong to the tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Booking must belong to the User'],
    },
    price: {
        type: Number,
        require: [true, 'Booking must Have price'],
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
});

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name -guides imageCover slug',
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
