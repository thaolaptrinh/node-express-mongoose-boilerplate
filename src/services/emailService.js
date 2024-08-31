import nodemailer from 'nodemailer';
import config from 'config';
import logger from '../config/logger.js';

const {
    default: defaultMailer,
    mailers,
    from,
} = config.util.toObject(config.get('mail'));

let transporter = null;

// Create a nodemailer transporter based on the default mailer
if (defaultMailer === 'smtp') {
    transporter = nodemailer.createTransport(mailers.smtp);
}

// Check if the mailer is configured
if (transporter !== null && typeof transporter.verify === 'function') {
    transporter.verify((error) => {
        if (error) {
            logger.error('Error verifying the mailer transporter', error);
        } else {
            logger.info('Mailer transporter is ready');
        }
    });
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendMail = async (to, subject, text, html = '') => {
    const customFrom = `${from.name} <${from.address}>`;
    const info = await transporter.sendMail({
        from: customFrom,
        to,
        subject,
        text,
        html,
    });

    logger.info(`Email sent: ${info.messageId}`);
};

/**
 * Send a reset password email
 * @param {string} email
 * @param {string} resetPasswordToken
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (email, resetPasswordToken) => {
    const resetPasswordUrl = `${config.get('app.frontendUrl')}/reset-password?token=${resetPasswordToken}`;
    const subject = 'Reset password';
    const text = `Reset password link: ${resetPasswordUrl}`;
    const html = `<a href="${resetPasswordUrl}" target="_blank">Reset password</a>`;

    await sendMail(email, subject, text, html);
};

/**
 * Send a verification email
 * @param {string} email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const sendVerificationEmail = async (email, verifyEmailToken) => {
    const verifyEmailUrl = `${config.get('app.frontendUrl')}/verify-email?token=${verifyEmailToken}`;
    const subject = 'Verify email';
    const text = `Verify email link: ${verifyEmailUrl}`;
    const html = `<a href="${verifyEmailUrl}" target="_blank">Verify email</a>`;

    await sendMail(email, subject, text, html);
};

export default {
    sendMail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
