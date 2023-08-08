//! 1. Creating backend server using Express.js

const express = require("express"); // express framework
const cors = require("cors"); // import Cross-Origin Resource Sharing
const mongoose = require("mongoose"); // mongoose for MongoDB connection
const dotenv = require("dotenv"); // import dotenv for environment variables
dotenv.config(); // initialize dotenv
const app = express();

// route handling
app.get("/", (req, res) => {
	res.send("Hello, world!");
});

// JSON parsing - middleware
app.use(express.json());

// CORS configuration - middleware
app.use(cors()); // frontend to backend requests

// MongoDB connection
const port = 5000;

//! 2. Connecting to MongoDB

const mongo_uri = process.env.MONGO_URI; //* get MongoDB URI from .env file
mongoose
	.connect(mongo_uri, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("Error connecting to MongoDB:", err);
	});

// ------------------------------------------------------------
// Server start and listen
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

//! 3. under models/user.js

//! 4. User registration and login routes

const bcrypt = require("bcrypt"); // import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // import jsonwebtoken for user authentication
const User = require("./models/User"); // import User model from models/User.js

const router = express.Router(); // create express router

// Route for user registration
router.post("/register", async (req, res) => {
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
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Route for user login
router.post("/login", async (req, res) => {
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

// Use the router for /api/user route
app.use("/api/user", router);
