import Joi from 'joi';
import { objectId, password } from './customValidation.js';

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        username: Joi.string().alphanum().min(6).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        username: Joi.string().alphanum().min(6).max(30),
        email: Joi.string().email(),
        password: Joi.string().custom(password),
    }),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

export default {
    createUser,
    getUser,
    updateUser,
    deleteUser,
};
