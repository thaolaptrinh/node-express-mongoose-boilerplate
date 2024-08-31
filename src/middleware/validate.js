import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import { pick } from '../utils/helpers.js';

// eslint-disable-next-line no-unused-vars
const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .preferences({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        console.log(error.details);
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};

export default validate;
