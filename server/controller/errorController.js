const AppError = require('./../utils/appErrors');
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            console.error('Error 💥', err);

            res.status(500).json({
                status: 'Error',
                message: 'Something went wrong',
            });
        }
    } else {
        if (err.isOperational) {
            res.status(500).json({
                status: 'Error',
                message: err.message,
            });
        } else {
            console.error('Error 💥', err);

            res.status(err.statusCode).json({
                status: 'Something went wrong',
                msg: 'Please try again later',
            });
        }
    }
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    console.log(value[0]);
    const message = `Duplicate field value: ${value[0]}. Please Use Unique value`;

    return new AppError(message, 400);
};

const handleValidationErrordDB = (err) => {
    const errors = Object.values(err.errors)
        .map((e) => e.message)
        .join('. ');
    const message = `Invalid Input Data: ${errors}`;
    return new AppError(message, 400);
};

const handleJWTError = () => {
    return new AppError('Invalid token please login again', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Your token is expired! Please login again', 401);
};
exports.errorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrordDB(err);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }

    next();
};
