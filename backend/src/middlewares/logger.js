import winston from 'winston';

// Configurer le logger Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

// Middleware pour enregistrer les requêtes
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
};

export default requestLogger;
