import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const authenticate = expressAsyncHandler(async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		const token = req.headers.authorization.split(" ")[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await User.findById(decoded.id).select("-password");
		next();
	} else {
		return res
			.status(401)
			.json({ message: "Authentication failed. No token provided" });
	}
});
