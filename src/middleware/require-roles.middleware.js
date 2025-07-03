import expressAsyncHandler from "express-async-handler";

export const authorizeRoles = (requiredRoles) =>
	expressAsyncHandler(async (req, res, next) => {
		if (!requiredRoles.includes(req.user.role)) {
			return res
				.status(403)
				.json({ message: "Access denied. Insufficient roles" });
		}
		next();
	});
