const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log(err.name + ' => ' + err.message);
    console.error('Stack Trace:', err.stack);
    console.error('Uncaught exception Shutting down....');

    process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
    console.log('DB Connected...');
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    // console.log(`server is running on port:${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.error(err.name + ' => ' + err);
    console.error('Stack Trace:', err.stack);

    console.error('Unhandled rejection Shutting down....');
    server.close(() => {
        process.exit(1);
    });
});
