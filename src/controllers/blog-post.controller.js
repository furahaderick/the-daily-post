import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { marked } from "marked";

import BlogPost from "../models/blog-post.model.js";
import BlogPostVersion from "../models/blog-post-version.model.js";

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

export const publishBlogPost = expressAsyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, content } = req.body;
	const { blogPostId } = req.params;

	const currentBlogPost = await BlogPost.findById(blogPostId);
	if (!currentBlogPost || currentBlogPost.state === "published") {
		return res
			.status(404)
			.json({ message: "Blog post not found or Already published" });
	}

	// Create a new version entry
	await BlogPostVersion.create({
		postId: currentBlogPost._id,
		versionNumber:
			(await BlogPostVersion.countDocuments({
				postId: currentBlogPost._id,
			})) + 1,
		title: currentBlogPost.title,
		content: currentBlogPost.content,
	});

	currentBlogPost.title = title;
	currentBlogPost.content = content;
	currentBlogPost.state = "published";
	currentBlogPost.publishedAt = new Date();
	await currentBlogPost.save();

	res.status(200).json({
		message: "Blog post published and version saved successfully",
	});
});

export const unpublishBlogPost = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost || blogPost.state === "draft") {
		return res
			.status(404)
			.json({ message: "Blog post not found or Already a draft" });
	}

	blogPost.state = "draft";
	blogPost.publishedAt = null;
	await blogPost.save();

	res.status(200).json({ message: "Blog post unpublished successfully" });
});

export const fetchBlogPost = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	res.status(200).json(blogPost);
});

// TODO: Add an interface for submitting markdown files too

export const readBlogPost = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	const htmlContent = await marked.parse(blogPost.content);

	res.status(200).send(htmlContent);
});

export const fetchPublishedPosts = expressAsyncHandler(async (req, res) => {
	const allPosts = await BlogPost.find({ state: "published" }).sort({
		publishedAt: -1,
	});
	res.status(200).json(allPosts);
});

export const fetchDraftPosts = expressAsyncHandler(async (req, res) => {
	const drafts = await BlogPost.find({
		state: "draft",
		author: req.user?._id,
	});
	res.status(200).json(drafts);
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

	if (!blogPost.author.equals(req.user?.id)) {
		return res
			.status(400)
			.json({ message: "You can only edit your own posts" });
	}

	if (blogPost.state !== "draft") {
		return res.status(400).json({ message: "Only drafts can be edited" });
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

export const addTagsToPost = expressAsyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { blogPostId } = req.params;
	const { tags } = req.body;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	blogPost.tags = Array.from(new Set([...blogPost.tags, ...tags]));
	await blogPost.save();

	res.status(200).json({ message: "Blog post tags added successfully" });
});

export const removeTagsFromPost = expressAsyncHandler(async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { blogPostId } = req.params;
	const { tags } = req.body;

	const blogPost = await BlogPost.findById(blogPostId);
	if (!blogPost) {
		return res.status(404).json({ message: "Blog post not found" });
	}

	blogPost.tags = blogPost.tags.filter((tag) => !tags.includes(tag));
	await blogPost.save();

	res.status(200).json({ message: "Blog post tags removed successfully" });
});

export const getPostEditVersion = expressAsyncHandler(async (req, res) => {
	const { blogPostId, versionNumber } = req.params;

	const blogPostVersion = await BlogPostVersion.findOne({
		postId: blogPostId,
		versionNumber,
	});

	if (!blogPostVersion) {
		return res
			.status(404)
			.json({ message: "The specified version doesn't exist" });
	}

	res.status(200).json(blogPostVersion);
});

export const getBlogPostVersions = expressAsyncHandler(async (req, res) => {
	const { blogPostId } = req.params;

	const blogPostVersions = await BlogPostVersion.find({
		postId: blogPostId,
	}).sort({ versionNumber: -1 });

	res.status(200).json(blogPostVersions);
});
