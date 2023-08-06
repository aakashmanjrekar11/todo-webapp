const express = require("express");
const app = express();
const port = 3000;

// Example route handling
app.get("/", (req, res) => {
	res.send("Hello, world!");
});

// Example middleware
app.use(express.json());

// Example CORS configuration
app.use(cors());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
