import mongoose from "mongoose";

const verifyTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
});

const VerifyToken = mongoose.model("VerifyToken", verifyTokenSchema);

export default VerifyToken;
