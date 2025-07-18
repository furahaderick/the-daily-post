import express from "express";

import {
	createBlogPost,
	fetchBlogPost,
	fetchAllBlogPosts,
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
blogPostRouter.get("/:blogPostId", fetchBlogPost);
blogPostRouter.get("/", fetchAllBlogPosts);
blogPostRouter.put(
	"/:blogPostId",
	authenticate,
	authorizeRoles(["author", "admin"]),
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
