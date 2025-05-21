import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/config.js';

// Inscription
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// Déconnexion (côté client, invalider le token)
export const logout = (req, res) => {
  res.json({ message: 'Déconnexion réussie' }); // Le token est géré côté client
};

// Suppression de compte
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Depuis middleware auth
    await User.findByIdAndDelete(userId);
    await Task.deleteMany({ user: userId }); // Supprimer les tâches associées
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
};