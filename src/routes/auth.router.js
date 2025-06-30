import express from "express";

import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../middleware/validator.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, register);

export default authRouter;
