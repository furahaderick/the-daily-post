import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, res) => {
	const payload = {
		id: user._id,
		username: user.username,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("access_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 1296000000, // 15 days
		sameSite: "strict",
	});
};
