import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = expressAsyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify the token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user claims from token
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (err) {
			console.error(err);
			res.status(401).json({ message: "Not authorized" });
			throw new Error("Not Authorized");
		}
	}

	if (!token) {
		res.status(401).json({ message: "Not authorized. No token provided!" });
		throw new Error("Not Authorized, No Token");
	}
});
