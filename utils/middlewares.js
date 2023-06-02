module.exports = {
  auth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.redirect("/login");
  },
  isAdmin: async (req, res, next) => {
    if (req.isAuthenticated()) {
      const user = req.user; // Assuming user object is available after authentication

      if (user.role_id === 1) {
        // User is an admin
        return next();
      }

      // User is not an admin, handle accordingly (e.g., redirect or error response)
      return res
        .status(403)
        .json({ message: "Access denied. User is not an admin." });
    }

    // User is not authenticated, handle accordingly (e.g., redirect or error response)
    return res.redirect("/login");
  },
};
