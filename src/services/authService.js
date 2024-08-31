/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import Token from '../models/tokenModel.js';
import ApiError from '../utils/ApiError.js';
import userService from './userService.js';
import tokenService from './tokenService.js';

/**
 * Login with username or email and password
 * @param {string} emailOrUsername
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (emailOrUsername, password) => {
    const user = await userService.getUserByEmailOrUsername(emailOrUsername);

    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Incorrect account or password'
        );
    }

    return user;
};

const logout = async (refreshToken) => {
    const refreshTokenDocument = await Token.findOne({
        token: refreshToken,
        type: 'refresh',
        blacklisted: false,
    });

    if (!refreshTokenDocument) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }

    await refreshTokenDocument.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshTokens = async (refreshToken) => {
    try {
        const refreshTokenDocument = await tokenService.verifyToken(
            refreshToken,
            'refresh'
        );
        const user = await userService.getUserById(refreshTokenDocument.userId);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDocument.remove();
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDocument = await tokenService.verifyToken(
            resetPasswordToken,
            'reset_password'
        );
        const user = await userService.getUserById(
            resetPasswordTokenDocument.userId
        );
        if (!user) {
            throw new Error();
        }
        await Token.deleteMany({ userId: user.id, type: 'reset_password' });
        await userService.updateUserById(user.id, { password: newPassword });
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDocument = await tokenService.verifyToken(
            verifyEmailToken,
            'verify_email'
        );
        const user = await userService.getUserById(
            verifyEmailTokenDocument.userId
        );
        if (!user) {
            throw new Error();
        }
        await Token.deleteMany({ userId: user.id, type: 'verify_email' });
        await userService.updateUserById(user.id, {
            emailVerifiedAt: Date.now(),
        });
    } catch (error) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'Email verification failed'
        );
    }
};

export default {
    login,
    logout,
    refreshTokens,
    resetPassword,
    verifyEmail,
};
