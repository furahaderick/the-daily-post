import crypto from "node:crypto";

import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import VerifyToken from "../models/email-verify-token.model.js";

import { generateTokenAndSetCookie } from "../lib/utils/token.utils.js";

export const register = expressAsyncHandler(async (req, res) => {
	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { fullName, username, email, password } = req.body;

	// Check if username already exists
	const existingUsername = await User.findOne({ username });
	if (existingUsername) {
		return res.status(400).json({ message: "Username is already taken" });
	}

	// Check if email already exists
	const existingEmail = await User.findOne({ email });
	if (existingEmail) {
		return res.status(400).json({ message: "Email is already registered" });
	}

	// Hash user password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create new user
	const newUser = await User.create({
		fullName,
		username,
		email,
		password: hashedPassword,
	});

	// Generate email verification link
	// TODO: To be sent via email
	const token = await VerifyToken.create({
		userId: newUser._id,
		token: crypto.randomBytes(32).toString("hex"),
	});

	const link = `${process.env.BASE_URL}/auth/verify/${newUser._id}/${token.token}`;

	res.status(201).json({
		message: `User registered successfully. Follow this link to verify your email: ${link}`,
	});
});

export const login = expressAsyncHandler(async (req, res) => {
	// Check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	// Find user by email
	const existingEmail = await User.findOne({ email });
	if (!existingEmail) {
		return res.status(404).json({ message: "User not found" });
	}

	// Compare passwords
	const matchingPasswords = await bcrypt.compare(
		password,
		existingEmail.password
	);
	if (!matchingPasswords) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	// Generate token and set cookie
	generateTokenAndSetCookie(existingEmail, res);

	res.status(200).json({ message: "Logged in successfully!" });
});

export const verifyEmail = expressAsyncHandler(async (req, res) => {
	const { userId, token } = req.params;

	const user = await User.findById(userId);
	if (!user) return res.status(400).json({ message: "Invalid link" });

	const verifyToken = await VerifyToken.findOne({ userId: user._id, token });
	if (!token) return res.status(400).json({ message: "Invalid link" });

	await User.findByIdAndUpdate(userId, { verified: true });
	await VerifyToken.findOneAndDelete(verifyToken._id);

	res.status(200).json({
		message: "Your email has been verified successfully",
	});
});
