import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 1800,
	},
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

export default ResetToken;
