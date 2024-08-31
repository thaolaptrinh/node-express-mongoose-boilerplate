import httpStatus from 'http-status';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isUsernameTaken(userBody.username)) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Username has already taken'
        );
    }

    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email has already taken');
    }

    return User.create(userBody);
};

/**
 * Get a user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

/**
 * Get a user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
    return User.findOne({ username });
};

/**
 * Get a user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

/**
 * Get user by email or username
 * @param {string} emailOrUsername
 * @returns {Promise<User>}
 */
const getUserByEmailOrUsername = async (emailOrUsername) => {
    if (emailOrUsername.includes('@')) {
        return getUserByEmail(emailOrUsername);
    }

    return getUserByUsername(emailOrUsername);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (
        updateBody.username &&
        (await User.isUsernameTaken(updateBody.username, userId))
    ) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Username has already taken'
        );
    }

    if (
        updateBody.email &&
        (await User.isEmailTaken(updateBody.email, userId))
    ) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email has already taken');
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await user.remove();
    return user;
};

export default {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    getUserByEmailOrUsername,
    updateUserById,
    deleteUserById,
};
