const { promisify } = require('util');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');
const Email = require('../utils/mail');

// const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (res, user, statusCode, message = null) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),

        httpOnly: true,
    };

    if (
        process.env.NODE_ENV === 'production' &&
        (res.req.secure || res.req.headers['x-forwarded-proto'] === 'https')
    ) {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }

    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    if (req.file) req.body.photo = req.file.filename;

    const newUser = await User.create(req.body);
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    createSendToken(res, newUser, 201, 'User Created Successfully');
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //login steps

    //1. check if email or password exist given from user
    if (!email || !password) {
        return next(new AppError('please provide email and password', 400));
    }
    //2. check if user exist and password is correct

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.checkHash(password, user.password)))
        return next(new AppError('Email or Password is incorrect', 401));
    //3. if okay send json token to client
    createSendToken(res, user, 201, 'you are logged in successfully!');
});

exports.protect = catchAsync(async (req, res, next) => {
    //1. getting the token and check if it exist

    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    //2. validate token
    if (!token)
        return next(
            new AppError(
                'you are not logged in! Please log in to get access',
                401,
            ),
        );
    //3. check if user still exists
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(
            new AppError(
                'The user belonging to this token is no longer exist',
                401,
            ),
        );
    }
    //4. check if user has changed password after jwt is issued
    if (user.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please login again'),
        );
    }
    req.user = user;
    res.locals.user = user;
    next();
});

//only for rendered pages no errors
exports.isLoggedIn = async (req, res, next) => {
    //1. getting the token and check if it exist
    let token;
    if (req.cookies.jwt) {
        try {
            token = req.cookies.jwt;

            //3. check if user still exists
            const decoded = await promisify(jwt.verify)(
                token,
                process.env.JWT_SECRET,
            );
            const freshUser = await User.findById(decoded.id);
            if (!freshUser) {
                return next();
            }
            //4. check if user has changed password after jwt is issued
            if (freshUser.changePasswordAfter(decoded.iat)) {
                return next();
            }

            //logged in user...
            res.locals.user = freshUser;
            return next();
        } catch {
            return next();
        }
    }
    next();
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'You are logged out',
    });
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You dont have permission to perform this action'),
                403,
            );
        }
        next();
    };
};

exports.sendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+active');
    if (!user)
        return next(
            new AppError('User is not found! Please signup first', 404),
        );
    if (!user.active) return next(new AppError('Account is deleted', 404));

    if (
        user.passwordOtpSentAt &&
        user.passwordOtpSentAt.getTime() > Date.now() - 60 * 1000
    ) {
        return next(
            new AppError(
                'OTP has been already sent recently! Please wait before requesting again.',
                400,
            ),
        );
    }

    const otp = user.generateOtp();
    if (process.env.NODE_ENV === 'production')
        await new Email(user, otp).sendPasswordResetOtp();
    await user.save({ validateBeforeSave: false });
    if (process.env.NODE_ENV === 'development') console.log(otp);

    res.status(201).json({
        status: 'success',
        message: `Verification otp sent to: ${email}`,
        otp,
    });
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new AppError('Email and OTP are required', 400));
    }

    const user = await User.findOne({
        email,
    }).select('+passwordResetOTP +passwordResetOTPExpires');

    if (!user) {
        return next(new AppError('No user found with this email', 400));
    }

    if (!user.passwordResetOTP)
        return next(new AppError('Please generate new otp first!', 400));

    if (user.passwordResetOTPExpires < Date.now())
        return next(
            new AppError('Otp is expired! Please generate new otp', 403),
        );
    if (!(await user.checkHash(otp, user.passwordResetOTP)))
        return next(new AppError('Invalid OTP! Please Try again', 404));
    user.otpVerified = true;
    user.passwordResetOTP = null;
    user.passwordResetOTPExpires = null;
    user.passwordOtpSentAt = null;
    user.otpSessionExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'Otp Verified Successfully',
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({
        email,
    });

    if (!user)
        return next(new AppError('Error findind user! Please Try again', 400));

    if (!user.otpVerified)
        return next(
            new AppError(
                'Please Verify your otp first to change password!',
                400,
            ),
        );
    if (user.otpSessionExpires < Date.now()) {
        user.otpVerified = false;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'Session has expired! Please reverify OTP to change password',
                400,
            ),
        );
    }

    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    user.otpVerified = false;
    user.otpSessionExpires = null;
    await user.save();

    createSendToken(res, user, 201, 'Password has been reset successfully');
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne(req.user._id).select('+password');

    if (!user)
        return next(new AppError('Please login first to change the password'));

    if (!currentPassword || !newPassword)
        return next(
            new AppError(
                'Please provide current password and new password',
                404,
            ),
        );
    if (!(await user.checkHash(currentPassword, user.password)))
        return next(
            new AppError(
                'current password does not match! please use correct password',
                403,
            ),
        );

    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    await user.save();

    createSendToken(res, user, 201, 'Your password is succesfully changed');
});
