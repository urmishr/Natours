const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us youe name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address!'],
        unique: true,
        lowerCase: true,
        validate: [validator.isEmail, 'Please provide valid Email!'],
    },
    photo: { type: String, default: 'default.jpg' },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please Provide password!'],
        minLength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Provide  confirm password!'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Confirm password must match the password',
        },
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordResetOTP: { type: String, select: false },
    passwordOtpSentAt: Date,
    passwordResetOTPExpires: Date,
    otpVerified: { type: Boolean, default: false },
    otpSessionExpires: Date,
    active: { type: Boolean, default: true, select: false },
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

//password managment
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
        if (!this.isNew) {
            this.passwordChangedAt = Date.now() - 1000;
        }
    }

    // Hash OTP if modified
    if (this.isModified('passwordResetOTP') && this.passwordResetOTP) {
        this.passwordResetOTP = await bcrypt.hash(this.passwordResetOTP, 10);
    }
    next();
});

userSchema.methods.checkHash = async function (userValue, dbValue) {
    return await bcrypt.compare(userValue, dbValue);
};

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.generateOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.passwordResetOTP = otp;
    this.passwordOtpSentAt = Date.now();
    this.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
