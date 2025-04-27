const APIFeature = require('../utils/APIFeature');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');
exports.deleteOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc)
            return next(
                new AppError(`could not find Document: ${req.params.id}`, 404),
            );
        res.status(204).json({
            status: 'success',
            message: `${req.params.id} deleted succesfully`,
        });
    });
};

exports.updateOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        );
        if (!document)
            return next(
                new AppError(`could not find document: ${req.params.id}`, 404),
            );
        res.status(200).json({ status: 'success', data: document });
    });
};

exports.createOne = (Model) => {
    return catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { tour: doc },
        });
    });
};

exports.getOne = (Model, popOption) => {
    return catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOption) query = query.populate(popOption);
        const doc = await query;

        if (!doc)
            return next(
                new AppError(`could not find id ${req.params.id}`, 404),
            );

        res.status(200).json({
            status: 'Success',
            data: {
                doc,
            },
        });
    });
};

exports.getAll = (Model) => {
    return catchAsync(async (req, res, next) => {
        // allow nested troutes for reviews
        let filter;
        if (req.params.tourId) filter = { tour: req.params.tourId };
        //Execute query
        const feautures = new APIFeature(Model.find(filter), req.query)
            .filter()
            .sort()
            .paginate()
            .fields();
        const docs = await feautures.query;

        res.status(200).json({
            status: 'success',
            result: docs.length,
            data: {
                docs,
            },
        });
    });
};
