import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["admin", "author", "reader"], default: "reader" },
});

const User = mongoose.model("User", userSchema);

export default User;
