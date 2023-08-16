//! 5. ToDo list APIs
// Defining a model -> mongoose schema for the task
const mongoose = require("mongoose");

// create task schema
const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		min: 3,
		max: 255,
	},
	description: {
		type: String,
		required: true,
		min: 6,
		max: 1024,
	},
	completed: {
		type: Boolean,
		required: true,
		default: false,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// export task model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
