const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const route = express.Router();

route.post(
    '/signup',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    authController.signup,
);
route.post('/login', authController.login);
route.get('/logout', authController.logout);
route.post('/forgot-password/send-otp', authController.sendOTP);
route.post('/forgot-password/verify-otp', authController.verifyOtp);
route.patch('/reset-password', authController.resetPassword);
// route.post('/forgot-password', authController.forgotPassword);
// route.patch('/reset-password/:token', authController.resetPassword);

route.use(authController.protect);
route.get(
    '/me',
    userController.getMe,
    userController.getUser,
    userController.filterUserFields, // Add this middleware to filter fields
);
route.patch(
    '/update-password',

    authController.updatePassword,
);
route.patch(
    '/update-me',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
);
route.delete('/delete-me', userController.deleteMe);
route.use(authController.restrictTo('admin'));
route
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
route
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = route;
