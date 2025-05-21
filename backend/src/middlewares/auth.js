import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Middleware pour vérifier le token JWT
const auth = async (req, res, next) => {
    try {
        const token = req.header( 'Authorization' )?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentification requise');
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Jeton invalide ou manquant' });
    }
};

export default auth;