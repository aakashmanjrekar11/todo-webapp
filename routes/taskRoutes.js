//! 5. ToDo list APIs
const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // import Task model from models/Task.js
// const { findByIdAndUpdate } = require("./models/task");
const verifyToken = require("../verifyToken.js"); // import verifyToken middleware

// Route for creating a new task
router.post("/tasks", verifyToken, async (req, res) => {
	try {
		const task = new Task(req.body); // create a new task with request body
		await task.save(); // save the task to database
		res.status(201).json({ message: "Task created successfully", task });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Route for fetching all tasks
router.get("/tasks", verifyToken, async (req, res) => {
	try {
		const tasks = await Task.find(); // fetch all tasks from database
		res.status(200).json({ message: "Tasks fetched successfully" }, tasks);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route for updating a task by id
router.put("/tasks/:id", verifyToken, async (req, res) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		}); // find task by id and update it with request body
		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.status(200).json({
			message: "Task updated successfully",
			data: task,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Route for deleting a task by id
router.delete("/tasks/:id", verifyToken, async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id); // find task by id and delete it
		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router; // export router for use in server.js
