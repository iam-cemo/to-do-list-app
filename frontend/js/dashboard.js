// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return null;
    }
    return token;
}

// Toast notification function
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

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Create task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
        <div class="card task-card h-100">
            <div class="card-body">
                <span class="badge priority-${task.priority} priority-badge">${task.priority}</span>
                <h5 class="card-title mb-3">${task.title}</h5>
                <p class="card-text">${task.description || ''}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">Due: ${formatDate(task.dueDate)}</small>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${task.completed ? 'checked' : ''}
                            onchange="toggleTaskStatus('${task._id}', this.checked)">
                        <label class="form-check-label">Complete</label>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-transparent border-top-0">
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editTask('${task._id}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTask('${task._id}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

// Fetch and display tasks
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
                        <p class="text-muted">No tasks found. Add your first task!</p>
                    </div>
                `;
                return;
            }

            tasks.forEach(task => {
                tasksGrid.appendChild(createTaskCard(task));
            });
        } else {
            showToast('Failed to fetch tasks', 'danger');
        }
    } catch (error) {
        showToast('An error occurred while fetching tasks', 'danger');
    }
}

// Add new task
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
            showToast('Task added successfully');
            bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
            e.target.reset();
            fetchTasks();
        } else {
            showToast('Failed to add task', 'danger');
        }
    } catch (error) {
        showToast('An error occurred while adding the task', 'danger');
    }
});

// Edit task
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
            showToast('Failed to fetch task details', 'danger');
        }
    } catch (error) {
        showToast('An error occurred while fetching task details', 'danger');
    }
}

// Update task
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
            showToast('Task updated successfully');
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
            fetchTasks();
        } else {
            showToast('Failed to update task', 'danger');
        }
    } catch (error) {
        showToast('An error occurred while updating the task', 'danger');
    }
});

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

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
            showToast('Task deleted successfully');
            fetchTasks();
        } else {
            showToast('Failed to delete task', 'danger');
        }
    } catch (error) {
        showToast('An error occurred while deleting the task', 'danger');
    }
}

// Toggle task status
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
            showToast('Task status updated');
        } else {
            showToast('Failed to update task status', 'danger');
            fetchTasks(); // Refresh to show correct state
        }
    } catch (error) {
        showToast('An error occurred while updating task status', 'danger');
        fetchTasks(); // Refresh to show correct state
    }
}

// Filter tasks
function filterTasks() {
    const priority = document.getElementById('priorityFilter').value;
    const status = document.getElementById('statusFilter').value;
    const tasks = document.querySelectorAll('.task-card');

    tasks.forEach(task => {
        const taskPriority = task.querySelector('.priority-badge').textContent;
        const taskCompleted = task.querySelector('.form-check-input').checked;
        const matchesPriority = !priority || taskPriority === priority;
        const matchesStatus = !status || 
            (status === 'completed' && taskCompleted) || 
            (status === 'pending' && !taskCompleted);

        task.parentElement.style.display = matchesPriority && matchesStatus ? '' : 'none';
    });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    fetchTasks();

    // Set up filter listeners
    document.getElementById('priorityFilter').addEventListener('change', filterTasks);
    document.getElementById('statusFilter').addEventListener('change', filterTasks);
});