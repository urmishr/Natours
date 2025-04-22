const express = require('express');
const path = require('path');

const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const AppError = require('./utils/appErrors');
const errorHandler = require('./controller/errorController');
const viewRouter = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares

// web secureity
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': ["'self'"],
            'script-src': [
                "'self'",
                'https://unpkg.com',
                ' https://cdnjs.cloudflare.com',
                '/login',
                'https://js.stripe.com/',
            ],
            'connect-src': ["'self'", 'ws://localhost:1234/'],
            'img-src': [
                "'self'",
                'Data:',

                'https://tile.openstreetmap.org',
                'https://unpkg.com',
                'https://tile.jawg.io/',
            ],
            'frame-src': ['https://js.stripe.com/'],
        },
    }),
);

//Body parser from requests
app.use(
    express.json({
        limit: '10kb',
    }),
);
app.use(compression());

app.use(cookieParser());

//data sanitizaions NOSQL query injection
app.use(mongoSanitize());

//data sanitizaions Xss
app.use(xss());

//parameter pollution control
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    }),
);

//use Morgan logs for development Ex.(GET /api/v1/tours/ 200 75.978 ms - 9045)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//rate limiter
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this ip! rate limit exceeded',
});
app.use('/api', limiter);

//used for logging details and adding current request time
app.use((req, res, next) => {
    req.reqestTime = new Date().toISOString();
    // console.log(req.headers)
    next();
});

//Route handleres
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRoutes);

//global route not found error handler
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global app error handler
app.use(errorHandler.errorController);
// console.log('Current Env: ' + process.env.NODE_ENV);

module.exports = app;
