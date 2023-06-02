module.exports = {
  auth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.redirect("/login");
  },
  isAdmin: async (req, res, next) => {
    if (req.isAuthenticated()) {
      const user = req.user;

      if (user.role_id === 1) {
        // User is an admin
        return next();
      }

      return res
        .status(403)
        .json({ message: "Access denied. User is not an admin." });
    }

    return res.redirect("/login");
  },
};
