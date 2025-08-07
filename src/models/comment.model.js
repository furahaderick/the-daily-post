import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		blogPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BlogPost",
			required: true,
		},
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
