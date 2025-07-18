import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import blogPostRouter from "./routes/blog-post.router.js";

const app = express();

// App-level Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.status(200).send("Server Up And Running");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", blogPostRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Internal Server Error");
});

export default app;
