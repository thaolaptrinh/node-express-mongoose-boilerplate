/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import config from 'config';
import logger from './logger.js';

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () =>
    config.get('app.env') === 'production' ? ':remote-addr - ' : '';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successLogger = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger.info(message.trim()) },
});

export const errorLogger = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
});
