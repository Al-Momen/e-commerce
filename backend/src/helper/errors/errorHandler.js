//Server Error Handling
export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Server Error';

    res.status(status).json({
        success: false,
        status,
        message
    });
}