import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

import BlogPost from "../models/blog-post.model.js";

export const createBlogPost = expressAsyncHandler(async (req, res) => {
	// Validate inputs
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, content } = req.body;
	const userId = req.user?._id;

	await BlogPost.create({
		title,
		content,
		author: userId,
	});

	res.status(201).json({ message: "Blog post created successfully" });
});

export const fetchBlogPost = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	res.status(200).json(blogPost);
});

export const fetchAllBlogPosts = expressAsyncHandler(async (req, res) => {
	const allPosts = await BlogPost.find();
	res.status(200).json(allPosts);
});

export const updateBlogPost = expressAsyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { blogPostId } = req.params;
	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	await BlogPost.findByIdAndUpdate(blogPostId, req.body);

	res.status(200).json({ message: "Blog post updated successfully" });
});

export const deleteBlogPost = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;
	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	// Author can only delete his/her own posts
	if (req.user?.role === "author") {
		if (!blogPost.author || !blogPost.author.equals(req.user?.id)) {
			return res
				.status(400)
				.json({ message: "You can only delete your posts" });
		}
	}

	await BlogPost.findByIdAndDelete(blogPostId);

	res.status(200).json({ message: "Blog post deleted successfully" });
});
