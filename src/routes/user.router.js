import express from "express";

import { authenticate } from "../middleware/token-verifier.middleware.js";

import { getLoggedInUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", authenticate, getLoggedInUser);

export default userRouter;
