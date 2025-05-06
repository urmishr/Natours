const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Tour = require('../model/tourModel');
const User = require('../model/userModel');
const Email = require('../utils/mail');

const catchAsync = require('../utils/catchAsync');
const factory = require('../controller/handlerFactory');
const Booking = require('../model/bookingModel');
const AppError = require('../utils/appErrors');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `https://natours.urmish.site/account/my-bookings`,
        cancel_url: `https://natours.urmish.site/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://natours-production-23d3.up.railway.app/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
            },
        ],
    });
    res.status(201).json({
        status: 'success',
        session,
    });
});

exports.webhookCheckout = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // raw body buffer, see note below
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Create booking in your DB
        await createBookingCheckout(session);
    }

    res.status(200).json({ received: true });
};

const createBookingCheckout = async (session) => {
    const tourId = session.client_reference_id;
    const userEmail = session.customer_email;

    // Find user by email (assuming you have User model)
    const user = await User.findOne({ email: userEmail });

    if (!user) {
        console.error('User not found for booking');
        return;
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
        console.error('Tour not found for booking');
        return;
    }

    const { price } = tour;
    const email = new Email(user, null);
    const bookingData = {
        tourName: tour.name,
        tourImage: `/img/tours/${tour.imageCover}`,
        price,
        tourUrl: `https://natours.urmish.site/tour/${tour.slug}`,
    };

    await email.sendBookingCompleted(bookingData);

    await Booking.create({
        tour: tourId,
        user: user._id,
        price,
    });
};

exports.getBookingByUserId = catchAsync(async (req, res, next) => {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id });
    if (!bookings)
        return next(
            new AppError('No bookings found! Please book a tour first'),
        );

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        message: `Booking found for user: ${_id}`,
        bookings,
    });
});

exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
