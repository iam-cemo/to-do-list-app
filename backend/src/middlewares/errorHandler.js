// Middleware pour gérer les erreurs

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'developpement' && { stack: err.stack})
    });
};

export default errorHandler;