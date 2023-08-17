//! 1. Creating backend server using Express.js
const express = require("express"); // express framework
const cors = require("cors"); // import Cross-Origin Resource Sharing
const mongoose = require("mongoose"); // mongoose for MongoDB connection
const dotenv = require("dotenv"); // import dotenv for environment variables
dotenv.config(); // initialize dotenv
const app = express();
const verifyToken = require("./verifyToken.js"); // import verifyToken

// route handling
// app.get("/", (req, res) => {
// 	res.send("Hello, world!");
// });

// JSON parsing - middleware
app.use(express.json());

// Allow requests from your Heroku app's domain
const allowedOrigins = [
	"https://minimal-todo-webapp-ee395c1f434c.herokuapp.com/",
	// Add any other origins that you want to allow
];

// CORS configuration - middleware
app.use(
	cors({
		origin: allowedOrigins,
	})
); // frontend to backend requests

//! 2. Connecting to MongoDB
const mongodb_uri = process.env.MONGODB_URI; //* get MongoDB URI from .env file
mongoose
	.connect(mongodb_uri, {
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
const userRoutes = require("./routes/userRoutes.js"); // import userRoutes from routes/userRoutes.js
app.use("/api/user", userRoutes); // Use the userRoutes with a base URL of '/api/user'

//! 5. ToDo list APIs
const taskRoutes = require("./routes/taskRoutes.js"); // import taskRoutes from routes/taskRoutes.js
app.use("/api/task", verifyToken, taskRoutes); // Use the userRoutes with a base URL of '/api/task'

//! ------------------------------------------------------------
//? Server start and listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
