export const getLoggedInUser = (req, res) => {
	// Check if user is authenticated
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	return res.status(200).json(req.user);
};
