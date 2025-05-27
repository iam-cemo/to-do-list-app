# TaskMaster Frontend

A modern, responsive frontend for the TaskMaster todo list application, built with HTML, CSS, and JavaScript using Bootstrap 5.

## Features

- User authentication (login/register)
- Task management (create, read, update, delete)
- Task filtering by priority and status
- Responsive design for all screen sizes
- Modern UI with animations and transitions
- Toast notifications for user feedback

## Getting Started

1. Make sure the backend server is running on `http://localhost:3000`
2. Open the frontend files using a local server (e.g., Live Server)
3. Access the application through the browser

## API Endpoints Used

- Authentication:
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - User login

- Tasks:
  - GET `/api/todos` - Get all tasks
  - POST `/api/todos` - Create new task
  - PUT `/api/todos/:id` - Update task
  - DELETE `/api/todos/:id` - Delete task
  - PATCH `/api/todos/:id` - Toggle task status

## Screenshots

[Add screenshots of your application here]

## Design Choices

- Color Scheme:
  - Primary: #007bff (Blue)
  - Success: #198754 (Green)
  - Warning: #ffc107 (Yellow)
  - Danger: #dc3545 (Red)
  - Background: #f8f9fa (Light Gray)

- Typography:
  - Font Family: 'Poppins'
  - Weights: 300, 400, 500, 600, 700

- Components:
  - Cards with hover effects
  - Responsive grid layout
  - Modern form controls
  - Toast notifications
  - Modal dialogs

## Accessibility Features

- ARIA labels for interactive elements
- Color contrast compliance
- Keyboard navigation support
- Screen reader friendly structure
- Clear focus indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)