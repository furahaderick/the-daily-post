import express from "express";

import {
	createBlogPost,
	publishBlogPost,
	unpublishBlogPost,
	fetchBlogPost,
	fetchDraftPosts,
	readBlogPost,
	fetchPublishedPosts,
	updateBlogPost,
	deleteBlogPost,
	addTagsToPost,
	removeTagsFromPost,
	getPostEditVersion,
	getBlogPostVersions,
	addCommentToPost,
	updateComment,
	deleteComment,
} from "../controllers/blog-post.controller.js";
import {
	blogPostValidator,
	updateBlogPostValidator,
	tagValidator,
} from "../middleware/validator.middleware.js";
import { authenticate } from "../middleware/token-verifier.middleware.js";
import { authorizeRoles } from "../middleware/require-roles.middleware.js";

const blogPostRouter = express.Router();

blogPostRouter.post(
	"/",
	authenticate,
	authorizeRoles(["author", "admin"]),
	blogPostValidator,
	createBlogPost
);

blogPostRouter.get("/", fetchPublishedPosts);

blogPostRouter.get("/:blogPostId/versions/:versionNumber", getPostEditVersion);

blogPostRouter.put(
	"/:blogPostId/comments/:commentId",
	authenticate,
	updateComment
);
blogPostRouter.delete(
	"/:blogPostId/comments/:commentId",
	authenticate,
	deleteComment
);

blogPostRouter.get("/:blogPostId/versions", getBlogPostVersions);

blogPostRouter.get("/:blogPostId/read", readBlogPost);

blogPostRouter.post("/:blogPostId/comments", authenticate, addCommentToPost);

blogPostRouter.post(
	"/:blogPostId/tags",
	authenticate,
	authorizeRoles(["author"]),
	tagValidator,
	addTagsToPost
);

blogPostRouter.delete(
	"/:blogPostId/tags",
	authenticate,
	authorizeRoles(["author"]),
	tagValidator,
	removeTagsFromPost
);

blogPostRouter.put(
	"/:blogPostId/publish",
	authenticate,
	authorizeRoles(["author"]),
	blogPostValidator,
	publishBlogPost
);

blogPostRouter.put(
	"/:blogPostId/unpublish",
	authenticate,
	authorizeRoles(["author", "admin"]),
	unpublishBlogPost
);

blogPostRouter.get("/:blogPostId", fetchBlogPost);

blogPostRouter.put(
	"/:blogPostId",
	authenticate,
	authorizeRoles(["author"]),
	updateBlogPostValidator,
	updateBlogPost
);

blogPostRouter.delete(
	"/:blogPostId",
	authenticate,
	authorizeRoles(["author", "admin"]),
	deleteBlogPost
);

blogPostRouter.get("/drafts", authenticate, fetchDraftPosts);

export default blogPostRouter;
