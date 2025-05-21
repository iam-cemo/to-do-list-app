import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import csrfProtection from './middlewares/csrfProtection.js';
import { validateUser, validateTask } from './middlewares/validate.js';
import sanitize from './middlewares/sanitize.js';
import requestLogger from './middlewares/logger.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { config } from './config/config.js';



// Initialiser l'application Express
const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger); // Enregistrer toutes les requêtes
app.use(sanitize); // Assainir toutes les entrées
app.use(csrfProtection); // Appliquer la protection CSRF aux routes qui en ont besoin


// Routes pour obtention de token CSRF
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes d'authentification et de gestion des tâches
app.use('/auth', authRoutes); 
app.use('/tasks', auth, taskRoutes); 

// Route principale (GET /)
app.get('/', (req, res) => {
  res.send('Bienvenue sur mon serveur Express !');
});


// Middleware de gestion des erreurs
app.use(errorHandler);


export { app };
