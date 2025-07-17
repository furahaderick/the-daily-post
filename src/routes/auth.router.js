import express from "express";

import {
    register,
    login,
    requestPasswordResetLink,
    resetPassword,
    verifyEmail
} from "../controllers/auth.controller.js";
import {
    registerValidator,
    loginValidator,
    passwordResetLinkValidator,
    resetPasswordValidator,
} from "../middleware/validator.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/verify/:userId/:token", verifyEmail);

authRouter.post(
	"/forgot-password",
	passwordResetLinkValidator,
	requestPasswordResetLink
);
authRouter.post(
	"/reset-password/:userId/:token",
	resetPasswordValidator,
	resetPassword
);

export default authRouter;
