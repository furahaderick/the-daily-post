import { body } from "express-validator";

export const registerValidator = [
	body("fullName").exists().withMessage("Your fullname is required"),
	body("username").exists().withMessage("Username is required"),
	body("email").isEmail().withMessage("Please enter a valid email address"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters"),
];

export const loginValidator = [
	body("email")
		.exists({ values: "falsy" })
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email address"),
	body("password").exists().withMessage("Password is required"),
];
