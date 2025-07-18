import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

export const getLoggedInUser = (req, res) => {
	// Check if user is authenticated
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return res.status(200).json(req.user);
};

export const updateLoggedInUser = expressAsyncHandler(async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Update any field the user might want to change without mandatory restrictions
	const updates = req.body;

	const allowedFields = ["fullName", "username", "email"];
	const updateData = {};

	allowedFields.forEach((field) => {
		if (updates[field] !== undefined) {
			updateData[field] = updates[field];
		}
	});

	// Update user
	const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
		new: true,
	});

	if (!updatedUser) {
		return res.status(404).json({ message: "Profile update failed" });
	}

	res.status(200).json({ message: "Profile updated successfully!" });
});

export const changePassword = expressAsyncHandler(async (req, res) => {
    // Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
    
	const { currentPassword, newPassword, confirmNewPassword } = req.body;
	const userId = req.user?._id;

	const user = await User.findById(userId);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	const passwordMatch = await bcrypt.compare(currentPassword, user.password);
	if (!passwordMatch) {
		return res.status(401).json({ message: "Incorrect current password." });
	}

	// Hash new password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	user.password = hashedPassword;
	await user.save();

	// Invalidate session
	res.cookie("access_token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(0), // Set to expire immediately
		sameSite: "strict",
	});

	res.status(200).json({ message: "Password changed successfully." });
});
