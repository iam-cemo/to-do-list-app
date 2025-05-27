import express from 'express';
import { register, login, logout, deleteAccount, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { validateUser } from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';
import passport from '../services/passport.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', validateUser, register);
router.post('/login', validateUser, login);
router.post('/logout', auth, logout);
router.delete('/delete-account', auth, deleteAccount);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', auth, changePassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirige vers le frontend après succès
    res.redirect('/dashboard');
  }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);


export default router;