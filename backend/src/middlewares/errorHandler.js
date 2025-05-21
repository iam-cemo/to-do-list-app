// Middleware pour gérer les erreurs

const errorHandler = (err, req, res, next) => {
    console.errorHandler(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Erreur interne du serveur',
        ...err(process.env.NODE_ENV === 'developpement' && { stack: err.stack})
    });
};

export default errorHandler;