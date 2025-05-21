import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';
import { validateTask, validateTaskFilters } from '../middlewares/validate.js';


const router = express.Router();

router.post('/', auth, validateTask, createTask);
router.get('/', auth, getTasks);
router.put('/:id', auth, validateTask, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;