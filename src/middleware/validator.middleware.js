import { body } from "express-validator";

export const registerValidator = [
	body("fullName").exists().withMessage("Your fullname is required"),
	body("username")
		.exists()
		.withMessage("Username is required")
		.isLength({ min: 3 })
		.withMessage("Username must be atleast 3 characters long"),
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

export const passwordResetLinkValidator = [
	body("email")
		.exists({ values: "falsy" })
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please enter a valid email address"),
];

export const resetPasswordValidator = [
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be atleast 6 characters"),
];
export const updateProfileValidator = [
	body("username")
		.optional()
		.isString()
		.isLength({ min: 3 })
		.withMessage("Username must be atleast 3 characters long"),
	body("email")
		.optional()
		.isEmail()
		.withMessage("Please enter a valid email address"),
];

export const setPasswordValidator = [
	body("currentPassword")
		.exists()
		.withMessage("Your current password is required"),
	body("newPassword")
		.exists()
		.withMessage("A new password is required")
		.isLength({ min: 6 })
		.withMessage("A password must be atleast 6 characters long"),
	body("confirmNewPassword")
		.custom((value, { req }) => value === req.body.newPassword)
		.withMessage("New password and confirmation do not match."),
];
