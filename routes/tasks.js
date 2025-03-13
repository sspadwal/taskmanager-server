import express from 'express';
import Task from '../models/Task.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


router.get('/', async(req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        res.status(200).json(tasks);
    } catch (error) { // Change 'err' to 'error'
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
});

router.post('/post', authMiddleware, async(req, res) => {
    const { title, description, priority } = req.body;


    if (!title || !description || !priority) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const task = new Task({ title, description, priority, user: req.userId });
        await task.save();

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {

        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});


router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { title, description, priority, completed } = req.body;

    try {
        const task = await Task.findOne({ _id: id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.completed = completed !== undefined ? completed : task.completed;

        await task.save();
        res.status(200).json(task);

    } catch (error) { // Change 'err' to 'error'
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

router.delete('/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) { // Change 'err' to 'error'
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});



export default router;