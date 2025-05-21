import Task from '../models/Task.js';
import slugify from 'slugify';

// Créer une tâche
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      category,
      user: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
};

// Lister les tâches
export const getTasks = async (req, res) => {
  try {
    const { priority, status, category, startDate, endDate, sortBy } = req.query;
    const query = { user: req.user.id };

    // Filtres
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    // Tri
    let sort = { createdAt: -1 }; // Tri par défaut : plus récent
    if (sortBy) {
      sort = {};
      const sortFields = sortBy.split(',').map((field) => {
        const [key, direction] = field.split(':');
        return [key, direction === 'desc' ? -1 : 1];
      });
      sortFields.forEach(([key, direction]) => {
        sort[key] = direction;
      });
    }

    const tasks = await Task.find(query).sort(sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
  }
};

// Mettre à jour une tâche
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description, dueDate, priority, status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    // Mettre à jour le slug si le titre change
    if (title) task.slug = slugify(title, { lower: true, strict: true });
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
  }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
  }
};