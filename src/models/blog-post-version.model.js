import mongoose from "mongoose";

const blogPostVersionSchema = new mongoose.Schema(
	{
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BlogPost",
		},
		versionNumber: Number,
		content: String,
		title: String,
		editedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: false }
);

const BlogPostVersion = mongoose.model(
	"BlogPostVersion",
	blogPostVersionSchema
);

export default BlogPostVersion;
