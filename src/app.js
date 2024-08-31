import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import createError from 'http-errors';
import config from 'config';
import { errorHandler } from './middleware/error.js';
import { successLogger, errorLogger } from './config/morgan.js';
import routes from './routes/index.js';

const app = express();

// set logger
app.use(successLogger);
app.use(errorLogger);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors(config.get('cors')));

// v1 api routes
app.use(routes);

// error api request not found
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    next(new createError.NotFound());
});

// error handler
app.use(errorHandler);

export default app;
