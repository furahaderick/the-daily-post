import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		state: {
			type: String,
			enum: ["draft", "published"],
			default: "draft",
		},
		publishedAt: {
			type: Date,
		},
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	},
	{ timestamps: true }
);

// Create a full-text index for searching purposes
blogPostSchema.index({ title: "text", content: "text" });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
