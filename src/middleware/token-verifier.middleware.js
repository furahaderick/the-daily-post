import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const authorize = (requiredRoles) =>
	expressAsyncHandler(async (req, res, next) => {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			const token = req.headers.authorization.split(" ")[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user role
			const userRole = (await User.findById(decoded.id))?.role;

			if (requiredRoles.includes(userRole)) {
				req.user = await User.findById(decoded.id).select("-password");
				next();
			} else {
				res.status(403).json({
					message: "403 Forbidden: Insufficient roles",
				});
			}
		} else {
			return res
				.status(401)
				.json({ message: "Authentication failed. No token provided" });
		}
	});
