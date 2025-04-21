const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
const mongoose = require('mongoose');

const Tour = require(`${__dirname}/../../model/tourModel`);
const User = require(`${__dirname}/../../model/userModel`);
const Review = require(`${__dirname}/../../model/reviewModel`);

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

async function connectDB() {
    try {
        await mongoose.connect(DB);
        // console.log('Mongo DB Connected');
    } catch (error) {
        console.log(error.message);
    }
}

connectDB();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const addTours = async () => {
    try {
        await Tour.create(tours, { validateBeforeSave: false });
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews, { validateBeforeSave: false });
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    addTours();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
