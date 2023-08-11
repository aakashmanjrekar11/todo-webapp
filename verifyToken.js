//* Protecting routes using JWT - middleware
const jwt = require("jsonwebtoken"); // import jsonwebtoken

const verifyToken = (req, res, next) => {
	const token = req.header("Authorization"); // get token from header
	if (!token) {
		return res.status(401).json({ error: "Access denied. Token missing." }); // if token is missing, return error
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verify token
		req.user = decoded.user; // add user from payload to request object
		next(); // call next middleware function
	} catch (error) {
		res.status(401).json({ error: "Invalid token." }); // if token is invalid, return error
	}
};

module.exports = verifyToken; // export verifyToken for use in routes/
