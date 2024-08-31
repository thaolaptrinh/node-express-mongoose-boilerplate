// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;

    const responseBody = {
        statusCode: err.statusCode,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
    };

    console.log(responseBody);
    res.json(responseBody);
};
