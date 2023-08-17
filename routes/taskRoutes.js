//! 5. ToDo list APIs
const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken.js"); // import verifyToken middleware
const Task = require("../models/Task.js"); // import Task model from models/Task.js

//* Route for creating a new task
router.post("/tasks", verifyToken, async (req, res) => {
	try {
		const userId = req.user; // Get the user's ID from the authenticated request

		const taskData = {
			title: req.body.title,
			description: req.body.description,
			completed: req.body.completed,
			userId: userId, // Associate the task with the user who created it
		};

		const task = new Task(taskData);

		await task.save(); // save the task to database

		res.status(201).json({ message: "Task created successfully", task });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//* Route for fetching all tasks
router.get("/tasks", verifyToken, async (req, res) => {
	try {
		const userId = req.user; // Get the user's ID from the authenticated request

		const tasks = await Task.find({ userId }); // Filter tasks based on the user's ID

		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//* Route for updating a task by id
router.put("/tasks/:id", verifyToken, async (req, res) => {
	try {
		const userId = req.user; // Get the user's ID from the authenticated request

		const task = await Task.findById(req.params.id); // Find the task by id

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Check if the task belongs to the authenticated user
		if (task.userId.toString() !== userId) {
			return res
				.status(403)
				.json({ error: "You do not have permission to update this task" });
		}

		// Update the task with the request body data
		task.title = req.body.title || task.title;
		task.description = req.body.description || task.description;
		task.completed = req.body.completed || task.completed;

		await task.save();

		res.status(200).json({
			message: "Task updated successfully",
			data: task,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

//* Route for deleting a task by id
router.delete("/tasks/:id", verifyToken, async (req, res) => {
	try {
		const userId = req.user; // Get the user's ID from the authenticated request

		const task = await Task.findById(req.params.id); // find task by id

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Check if the task belongs to the authenticated user
		if (task.userId.toString() !== userId) {
			return res
				.status(403)
				.json({ error: "You do not have permission to delete this task" });
		}

		await task.deleteOne(); // delete task from database

		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router; // export router for use in server.js
