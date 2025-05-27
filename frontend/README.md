# Frontend TaskMaster

Une interface moderne et responsive pour l'application de gestion de tâches TaskMaster, construite avec HTML, CSS et JavaScript utilisant Bootstrap 5.

## Fonctionnalités

- Authentification utilisateur (connexion/inscription)
- Gestion des tâches (création, lecture, mise à jour, suppression)
- Filtrage des tâches par priorité et statut
- Design responsive pour tous les écrans
- Interface moderne avec animations et transitions
- Notifications toast pour le feedback utilisateur

## Pour Commencer

1. Assurez-vous que le serveur backend est en cours d'exécution sur `http://localhost:3000`
2. Ouvrez les fichiers frontend en utilisant un serveur local (par exemple, Live Server)
3. Accédez à l'application via le navigateur

## Points d'API Utilisés

- Authentification :
  - POST `/api/auth/register` - Inscription d'un nouvel utilisateur
  - POST `/api/auth/login` - Connexion utilisateur

- Tâches :
  - GET `/api/todos` - Récupérer toutes les tâches
  - POST `/api/todos` - Créer une nouvelle tâche
  - PUT `/api/todos/:id` - Mettre à jour une tâche
  - DELETE `/api/todos/:id` - Supprimer une tâche
  - PATCH `/api/todos/:id` - Basculer le statut d'une tâche

## Choix de Design

- Palette de Couleurs :
  - Primaire : #007bff (Bleu)
  - Succès : #198754 (Vert)
  - Avertissement : #ffc107 (Jaune)
  - Danger : #dc3545 (Rouge)
  - Arrière-plan : #f8f9fa (Gris clair)

- Typographie :
  - Police : 'Poppins'
  - Graisses : 300, 400, 500, 600, 700

- Composants :
  - Cartes avec effets de survol
  - Disposition en grille responsive
  - Contrôles de formulaire modernes
  - Notifications toast
  - Boîtes de dialogue modales

## Fonctionnalités d'Accessibilité

- Labels ARIA pour les éléments interactifs
- Conformité du contraste des couleurs
- Support de la navigation au clavier
- Structure adaptée aux lecteurs d'écran
- Indicateurs de focus clairs

## Support Navigateur

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)