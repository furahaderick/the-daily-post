import express from "express";

import { authenticate } from "../middleware/token-verifier.middleware.js";

import {
	getLoggedInUser,
	updateLoggedInUser,
	changePassword,
} from "../controllers/user.controller.js";

import {
	updateProfileValidator,
	setPasswordValidator,
} from "../middleware/validator.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", authenticate, getLoggedInUser);
userRouter.post(
	"/me/update",
	authenticate,
	updateProfileValidator,
	updateLoggedInUser
);

// Change password while authenticated
userRouter.post(
	"/me/set-password",
	authenticate,
	setPasswordValidator,
	changePassword
);

export default userRouter;
