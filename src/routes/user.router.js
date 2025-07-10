import express from "express";

import { authenticate } from "../middleware/token-verifier.middleware.js";

import {
	getLoggedInUser,
	updateLoggedInUser,
} from "../controllers/user.controller.js";

import { updateProfileValidator } from "../middleware/validator.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", authenticate, getLoggedInUser);
userRouter.post(
	"/me/update",
	authenticate,
	updateProfileValidator,
	updateLoggedInUser
);

export default userRouter;
