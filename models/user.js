//! 4. Defininig the database schema for the user
const mongoose = require("mongoose");

// create user schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 3,
		max: 255,
	},
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024,
	},
	tasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task",
		},
	],
});

// export user model
const User = mongoose.model("User", userSchema);
module.exports = User;
