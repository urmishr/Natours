const catchAsync = require('./../utils/catchAsync');
const User = require('./../model/userModel');
const AppError = require('./../utils/appErrors');
const factoryController = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const filterObj = (obj, ...allowedField) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedField.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                "You can't change password from here please refer to forgot password",
                400,
            ),
        );
    }
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    await User.findOneAndUpdate(req.user._id, filteredBody, {
        runValidators: true,
        new: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser: {
                name: req.body.name,
                email: req.body.email,
            },
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.createUser = (req, res, next) => {
    res.status(404).json({
        status: 'Failed',
        message: 'Route not defined! Please use signup instead',
    });
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getUser = factoryController.getOne(User);

exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);
exports.getAllUsers = factoryController.getAll(User);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const fileName = `user-${req.user.id}-${Date.now()}.jpeg`;
    req.file.filename = fileName;
    await sharp(req.file.buffer)
        .resize(500, 500, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});

//if you want to save the image to the disk
const storage = multer.memoryStorage();

//if you want to save the image to the disk
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/img/users');
//     },
//     filename: function (req, file, cb) {
//         const fileName = `user-${req.user.id}-${Date.now()}.${file.mimetype.split('/')[1]}`;

//         cb(null, fileName);
//     },
// });

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                'Uploaded file is not an image type. Please use only images',
                400,
            ),
            false,
        );
    }
};
const upload = multer({ storage, fileFilter: multerFilter });
exports.uploadUserPhoto = upload.single('photo');
