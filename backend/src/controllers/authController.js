import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { config } from '../config/config.js';
import { sendPasswordResetEmail, sendAccountCreationEmail, sendAccountDeletionEmail } from '../services/emailService.js';

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

    // Envoyer un e-mail de confirmation
    await sendAccountCreationEmail(user);

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
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    await User.findByIdAndDelete(userId);
    await Task.deleteMany({ user: userId }); // Supprimer les tâches associées

    // Envoyer un e-mail de suppression de compte
    await sendAccountDeletionEmail(user);

    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
};

// Mot de passe oublié
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Utilisateur non trouvé ou compte OAuth' });
    }
    const resetToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    await sendPasswordResetEmail(user, resetToken);
    res.json({ message: 'E-mail de réinitialisation envoyé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
  }
};

// Réinitialisation du mot de passe
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Mot de passe réinitialisé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
  }
};

// Modification du mot de passe (utilisateur connecté)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Compte OAuth ou utilisateur non trouvé' });
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Ancien mot de passe incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe modifié' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe' });
  }
};