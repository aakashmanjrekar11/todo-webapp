//! 1. Creating backend server using Express.js
const express = require("express"); // express framework
const cors = require("cors"); // import Cross-Origin Resource Sharing
const mongoose = require("mongoose"); // mongoose for MongoDB connection
const dotenv = require("dotenv"); // import dotenv for environment variables
dotenv.config(); // initialize dotenv
const app = express();
const verifyToken = require("./verifyToken"); // import verifyToken

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

//! 3. under models/user.js

//! 4. User authentication APIs
const userRoutes = require("./routes/userRoutes"); // import userRoutes from routes/userRoutes.js
app.use("/api/user", verifyToken, userRoutes); // Use the userRoutes with a base URL of '/api/user'

//! 5. ToDo list APIs
const taskRoutes = require("./routes/taskRoutes"); // import taskRoutes from routes/taskRoutes.js
app.use("/api/task", verifyToken, taskRoutes); // Use the userRoutes with a base URL of '/api/task'

//! ------------------------------------------------------------
//? Server start and listen
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
