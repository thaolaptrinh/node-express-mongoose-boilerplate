import { fileURLToPath } from 'url';
import path from 'path';
import config from 'config';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsPath = (...paths) =>
    path.join(__dirname, '../../storage/logs', ...paths);

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const transports = [
    new winston.transports.Console({
        stderrLevels: ['error'],
    }),
];

if (config.get('logging.default') === 'stack') {
    transports.push(
        new winston.transports.File({
            filename: logsPath('error.log'),
            level: 'error',
        }),
        new winston.transports.File({
            filename: logsPath('combined.log'),
        })
    );
} else if (config.get('logging.default') === 'daily') {
    transports.push(
        new DailyRotateFile({
            level: 'error',
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        })
    );
}

const logger = winston.createLogger({
    level: config.get('app.env') === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development'
            ? winston.format.colorize()
            : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports,
});

export default logger;
