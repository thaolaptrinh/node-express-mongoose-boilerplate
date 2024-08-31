import express from 'express';
import validate from '../../middleware/validate.js';
import authValidation from '../../validation/authValidation.js';
import authController from '../../controllers/authController.js';

const router = express.Router();

router.post(
    '/register',
    validate(authValidation.register),
    authController.register
);

export default router;
