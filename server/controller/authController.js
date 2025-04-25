const { promisify } = require('util');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appErrors');
const Email = require('../utils/mail');

const crypto = require('crypto');

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

    if (process.env.NODE_ENV === 'production') {
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
    if (!user || !(await user.correctPassword(password, user.password)))
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new AppError('Email id is required!!!', 404));

    const user = await User.findOne({ email });

    if (!user)
        return next(new AppError('No user id found with this user id', 404));

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('Error sending email please try again!!', 404),
        );
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError('Token is invalid or expired', 400));

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    createSendToken(res, user, 201, 'you are logged in');
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
    if (!(await user.correctPassword(currentPassword, user.password)))
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
