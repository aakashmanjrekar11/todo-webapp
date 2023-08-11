//! 4. User registration and login routes
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // import jsonwebtoken for user authentication
const User = require("../models/User"); // import User model from models/User.js
const verifyToken = require("../verifyToken.js"); // import verifyToken middleware

// Route for user registration
router.post("/register", verifyToken, async (req, res) => {
	try {
		// get name, email, password from request body
		const { name, email, password } = req.body;

		// check if user already exists in database
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" }); // return error if user already exists
		}

		// hash the password with 10 rounds of salting (bcrypt)
		const hashedPassword = await bcrypt.hash(password, 10);

		// create a new user record in database
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		// save the new user record to database
		await newUser.save();
		// return success message
		res.status(201).json({
			message: "User registered successfully",
			data: null,
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Route for user login
router.post("/login", verifyToken, async (req, res) => {
	try {
		// get email and password from request body
		const { email, password } = req.body;

		// check if user exists in database
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User does not exist" }); // return error if user does not exist
		}

		// check if password is correct, compare the hashed password in database with the password that the user entered
		const passwordCorrect = await bcrypt.compare(password, user.password);
		if (!passwordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" }); // return error if password is incorrect
		}

		// Generate a JWT token -> sign the jsonwebtoken and send it to the user
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: "1h", // token expires in 1 hour
		});

		// return success message with token
		res.status(200).json({ message: "User logged in successfully", token });
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router; // export router for use in server.js
