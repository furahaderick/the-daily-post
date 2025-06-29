import mongoose from "mongoose";

export const startDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Database Running");
	} catch (err) {
		console.error(err.stack);
	}
};
