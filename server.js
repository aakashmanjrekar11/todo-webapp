//! 1. Creating backend server

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

const mongo_uri = process.env.MONGO_URI;
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
