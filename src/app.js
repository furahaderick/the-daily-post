import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.router.js";

const app = express();

// App-level Middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
	res.status(200).send("Server Up And Running");
});

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Internal Server Error");
});

export default app;
