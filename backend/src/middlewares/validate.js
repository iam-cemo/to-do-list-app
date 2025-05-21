import { body, query } from 'express-validator';

// Middleware de validation pour l'enregistrement des utilisateurs
export const validateUser = [
  body('email').isEmail().withMessage('Format d\'email invalide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware de validation pour la création de tâches
export const validateTask = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Format de date invalide'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('La priorité doit être basse, moyenne ou élevée'),
  body('status')
    .isIn(['to do', 'in progress', 'pending', 'completed'])
    .withMessage('Le statut doit être "A faire", "En cours", "En attente" ou "Terminée"'),
  body('category').optional().isString() .withMessage('La catégorie doit être une chaîne de caractères'),    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// Validation middleware pour les filtres
export const validateTaskFilters = [
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('La priorité doit être low, medium ou high'),
  query('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Le statut doit être pending ou completed'),
  query('category').optional().isString().withMessage('La catégorie doit être une chaîne'),
  query('startDate').optional().isISO8601().withMessage('Format de startDate invalide'),
  query('endDate').optional().isISO8601().withMessage('Format de endDate invalide'),
  query('sortBy')
    .optional()
    .matches(/^(title|dueDate|priority|status|createdAt):(asc|desc)(,(title|dueDate|priority|status|createdAt):(asc|desc))*$/)
    .withMessage('sortBy doit être au format champ:asc|desc,champ:asc|desc'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];