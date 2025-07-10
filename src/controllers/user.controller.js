import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

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
