// URL de base de l'API
const API_BASE_URL = 'http://localhost:3000/api';

// Vérification de l'authentification
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return null;
    }
    return token;
}

// Fonction de notification toast
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Formatage de la date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Création d'une carte de tâche
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
        <div class="card task-card h-100">
            <div class="card-body">
                <span class="badge priority-${task.priority} priority-badge">${
                    task.priority === 'low' ? 'Basse' :
                    task.priority === 'medium' ? 'Moyenne' : 'Haute'
                }</span>
                <h5 class="card-title mb-3">${task.title}</h5>
                <p class="card-text">${task.description || ''}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">Échéance: ${formatDate(task.dueDate)}</small>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''}
                            onchange="toggleTaskStatus('${task._id}', this.checked)">
                        <label class="form-check-label">Terminée</label>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-transparent border-top-0">
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task._id}')">
                        <i class="bi bi-pencil"></i> Modifier
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Récupération et affichage des tâches
async function fetchTasks() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const tasks = await response.json();
            const tasksGrid = document.getElementById('tasksGrid');
            tasksGrid.innerHTML = '';

            if (tasks.length === 0) {
                tasksGrid.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-muted">Aucune tâche trouvée. Ajoutez votre première tâche !</p>
                    </div>
                `;
                return;
            }

            tasks.forEach(task => {
                tasksGrid.appendChild(createTaskCard(task));
            });
        } else {
            showToast('Échec de la récupération des tâches', 'danger');
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de la récupération des tâches', 'danger');
    }
}

// Ajout d'une nouvelle tâche
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    if (!token) return;

    const formData = new FormData(e.target);
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            showToast('Tâche ajoutée avec succès');
            bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
            e.target.reset();
            fetchTasks();
        } else {
            showToast('Échec de l\'ajout de la tâche', 'danger');
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de l\'ajout de la tâche', 'danger');
    }
});

// Modification d'une tâche
async function editTask(taskId) {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const task = await response.json();
            const form = document.getElementById('editTaskForm');
            form.elements.taskId.value = task._id;
            form.elements.title.value = task.title;
            form.elements.description.value = task.description || '';
            form.elements.dueDate.value = task.dueDate ? task.dueDate.split('T')[0] : '';
            form.elements.priority.value = task.priority;

            const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
            modal.show();
        } else {
            showToast('Échec de la récupération des détails de la tâche', 'danger');
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de la récupération des détails de la tâche', 'danger');
    }
}

// Mise à jour d'une tâche
document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = checkAuth();
    if (!token) return;

    const formData = new FormData(e.target);
    const taskId = formData.get('taskId');
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            showToast('Tâche mise à jour avec succès');
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
            fetchTasks();
        } else {
            showToast('Échec de la mise à jour de la tâche', 'danger');
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de la mise à jour de la tâche', 'danger');
    }
});

// Suppression d'une tâche
async function deleteTask(taskId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast('Tâche supprimée avec succès');
            fetchTasks();
        } else {
            showToast('Échec de la suppression de la tâche', 'danger');
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de la suppression de la tâche', 'danger');
    }
}

// Basculer le statut d'une tâche
async function toggleTaskStatus(taskId, completed) {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            showToast('Statut de la tâche mis à jour');
        } else {
            showToast('Échec de la mise à jour du statut', 'danger');
            fetchTasks(); // Rafraîchir pour montrer l'état correct
        }
    } catch (error) {
        showToast('Une erreur est survenue lors de la mise à jour du statut', 'danger');
        fetchTasks(); // Rafraîchir pour montrer l'état correct
    }
}

// Filtrer les tâches
function filterTasks() {
    const priority = document.getElementById('priorityFilter').value;
    const status = document.getElementById('statusFilter').value;
    const tasks = document.querySelectorAll('.task-card');

    tasks.forEach(task => {
        const taskPriority = task.querySelector('.priority-badge').textContent.toLowerCase();
        const taskCompleted = task.querySelector('.form-check-input').checked;
        const matchesPriority = !priority || taskPriority === priority;
        const matchesStatus = !status || 
            (status === 'completed' && taskCompleted) || 
            (status === 'pending' && !taskCompleted);

        task.parentElement.style.display = matchesPriority && matchesStatus ? '' : 'none';
    });
}

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    fetchTasks();

    // Configuration des écouteurs de filtres
    document.getElementById('priorityFilter').addEventListener('change', filterTasks);
    document.getElementById('statusFilter').addEventListener('change', filterTasks);
});