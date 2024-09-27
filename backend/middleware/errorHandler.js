const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode || 500;
    let message = 'Internal Server Error';

    if (err.code === 11000) {
        statusCode = 400;
        message = "Username atau email sudah digunakan";
    } else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'develop' ? err.stack : {}
    });
};

module.exports = { errorHandler };