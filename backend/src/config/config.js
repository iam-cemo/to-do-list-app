import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret', // Clé secrète pour JWT
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist', // URI MongoDB
  PORT: process.env.PORT || 5000, // Port du serveur
  NODE_ENV: process.env.NODE_ENV || 'development', // Environnement (dev/production)
};