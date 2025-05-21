import { app } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from './config/config.js';

dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3000;

// Gestion des erreurs globales
const handleFatalError = (type) => (err) => {
  console.error(`${type} :`, err);
  process.exit(1);
};

process.on('unhandledRejection', handleFatalError('Erreur non capturée'));
process.on('uncaughtException', handleFatalError('Exception non capturée'));

// Connexion à MongoDB
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });


// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Arrêt du serveur
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Fermeture du serveur...');
  server.close(() => {
    console.log('Serveur arrêté.');
    process.exit(0);
  });
});