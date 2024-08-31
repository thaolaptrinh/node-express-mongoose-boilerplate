import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import userService from '../services/userService.js';

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = {};
    res.status(httpStatus.CREATED).send({ user, tokens });
});

export default {
    register,
};
