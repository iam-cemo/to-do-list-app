import express from 'express';
import { register, login, logout, deleteAccount } from '../controllers/authController.js';
import { validateUser } from '../middlewares/validate.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', validateUser, register);
router.post('/login', validateUser, login);
router.post('/logout', auth, logout);
router.delete('/delete-account', auth, deleteAccount);

export default router;