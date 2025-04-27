const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
module.exports = class Email {
    constructor(user, otp) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.otp = otp;
        this.from = `Natours || Nature and Tours <${process.env.BREVO_SENDER}>`;
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.BREVO_SERVER,
            port: process.env.BREVO_PORT,
            auth: {
                user: process.env.BREVO_LOGIN,
                pass: process.env.BREVO_PASSWORD,
            },
        });
    }

    async send(template, subject) {
        //send actual mail
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                otp: this.otp,
                subject,
            },
        );

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,

            text: htmlToText.convert(html),
        };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours family!');
    }
    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token is valid for 10 mins!',
        );
    }
    async sendPasswordResetOtp() {
        await this.send(
            'sendotp_template',
            'Your password reset OTP is valid for 10 mins!',
        );
    }
};
