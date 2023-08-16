//* Protecting routes using JWT - middleware
const jwt = require("jsonwebtoken"); // import jsonwebtoken

const verifyToken = (req, res, next) => {
	const token = req.header("Authorization"); // get token from header
	if (!token) {
		//todo - disabling verifyToken for now - need to figure out how to get token from header
		// return res.status(401).json({ error: "Access denied. Token missing." }); // if token is missing, return error
		return next(); //todo testing, remove return next(); later
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // verify token
		req.user = decoded.userId; // add user from payload to request object
		next(); // call next middleware function
	} catch (error) {
		console.error("Token verification error:", error);
		res.status(401).json({ error: "Invalid token." }); // if token is invalid, return error
	}
};

module.exports = verifyToken; // export verifyToken for use in routes/
