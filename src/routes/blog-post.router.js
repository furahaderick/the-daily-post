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
} from "../controllers/blog-post.controller.js";
import {
	createBlogPostValidator,
	updateBlogPostValidator,
} from "../middleware/validator.middleware.js";
import { authenticate } from "../middleware/token-verifier.middleware.js";
import { authorizeRoles } from "../middleware/require-roles.middleware.js";

const blogPostRouter = express.Router();

blogPostRouter.post(
	"/",
	authenticate,
	authorizeRoles(["author", "admin"]),
	createBlogPostValidator,
	createBlogPost
);

blogPostRouter.put(
	"/:blogPostId/publish",
    authenticate,
	authorizeRoles(["author"]),
	publishBlogPost
);

blogPostRouter.put(
	"/:blogPostId/unpublish",
    authenticate,
	authorizeRoles(["author", "admin"]),
	unpublishBlogPost
);

blogPostRouter.get("/drafts", authenticate, fetchDraftPosts);

blogPostRouter.get("/:blogPostId/read", readBlogPost);

blogPostRouter.get("/:blogPostId", fetchBlogPost);

blogPostRouter.get("/", fetchPublishedPosts);

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

export default blogPostRouter;
