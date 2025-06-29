import http from "node:http";

import { startDB } from "./config/database.config.js";

import app from "./app.js";
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
	startDB();
	console.log(`Server Running on *:${PORT}`);
});
