require('dotenv').config();

const env = process.env;

module.exports = {
    app: {
        name: env.APP_NAME,
        port: env.APP_PORT,
        env: env.NODE_ENV,
        frontendUrl: env.APP_FRONTEND_URL,
    },
    logging: {
        // channels include 'stack', 'daily'
        channel: env.LOG_CHANNEL || 'stack',
    },
    jwt: {
        secret: env.JWT_SECRET || 'secret',
        accessExpirationMinutes: env.JWT_ACCESS_EXPIRATION_MINUTES || '30',
        refreshExpirationDays: env.JWT_REFRESH_EXPIRATION_DAYS || '30',
        resetPasswordExpirationMinutes:
            env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || '10',
        verifyEmailExpirationMinutes:
            env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || '10',
    },
    cors: {
        origin: ['*'],
        methods: ['*'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 0,
        preflightContinue: false,
        optionsSuccessStatus: 200,
    },
    mongoose: {
        uri: env.MONGODB_URI,
        options: {},
    },
    mail: {
        // Default mailer
        default: env.MAIL_MAILER || 'smtp',

        // Mailer configurations
        mailers: {
            smtp: {
                host: env.MAIL_HOST || 'smtp.mailgun.org',
                port: env.MAIL_PORT || 587,
                secure: env.MAIL_PORT === 465,
                auth: {
                    username: env.MAIL_USERNAME,
                    password: env.MAIL_PASSWORD,
                },
            },
        },

        // Mail from configuration (default values)
        from: {
            address: env.MAIL_FROM_ADDRESS || 'hello@example.com',
            name: env.MAIL_FROM_NAME || 'Example',
        },
    },
};
