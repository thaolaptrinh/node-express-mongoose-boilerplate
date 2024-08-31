import Joi from 'joi';
import { password } from './customValidation.js';

const register = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().alphanum().min(6).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

export default {
    register,
};
