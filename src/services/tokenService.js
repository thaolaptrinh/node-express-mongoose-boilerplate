import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from 'config';
import Token from '../models/token.js';

/**
 * Generate a JWT token
 * @param {string} userId - The user id
 * @param {moment.Moment} expiresAt - The expiration date
 * @param {string} type - The token type
 * @param {string} secret - The secret key
 * @returns {string} The generated token
 */
const generateToken = (
    userId,
    expiresAt,
    type,
    secret = config.get('jwt.secret')
) => {
    const payload = {
        userId,
        type,
    };
    return jwt.sign(payload, secret, { expiresIn: expiresAt.unix() });
};

/**
 * Save the token to the database
 * @param {string} token - The token
 * @param {string} userId - The user id
 * @param {moment.Moment} expiresAt - The expiration date
 * @param {string} type - The token type
 * @param {boolean} blacklisted - If the token is blacklisted
 * @returns {Promise<Token>} The saved token
 */
const saveToken = async (
    token,
    userId,
    expiresAt,
    type,
    blacklisted = false
) => {
    const tokenDocument = await Token.create({
        userId,
        token,
        expiresAt: expiresAt.toDate(),
        type,
        blacklisted,
    });
    return tokenDocument;
};

/**
 * Verify a token
 * @param {string} token - The token
 * @param {string} type - The token type
 * @returns {Promise<Token>} The token document
 */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.get('jwt.secret'));
    const tokenDocument = await Token.findOne({
        token,
        type,
        userId: payload.userId,
        blacklisted: false,
    });
    if (!tokenDocument) {
        throw new Error(`Token::${type} not found`);
    }
    return tokenDocument;
};

/**
 * Generate a refresh token and a reset password token
 * @param {User} user - The user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(
        config.get('jwt.accessExpirationMinutes'),
        'minutes'
    );
    const accessToken = generateToken(user.id, accessTokenExpires, 'access');

    const refreshTokenExpires = moment().add(
        config.get('jwt.refreshExpirationDays'),
        'days'
    );
    const refreshToken = generateToken(user.id, refreshTokenExpires, 'refresh');

    return {
        access: {
            token: accessToken,
            expiresAt: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expiresAt: refreshTokenExpires.toDate(),
        },
    };
};

export default {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
};
