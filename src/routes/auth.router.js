import express from "express";

import {
	register,
	login,
	verifyEmail,
} from "../controllers/auth.controller.js";
import {
	registerValidator,
	loginValidator,
} from "../middleware/validator.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/verify/:userId/:token", verifyEmail);

export default authRouter;
