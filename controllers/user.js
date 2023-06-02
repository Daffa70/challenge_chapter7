const { User } = require("../db/models");
const bcryp = require("bcrypt");
const passport = require("../utils/passport");
const imagekit = require("../utils/imagekit");
const multer = require("multer");
const upload = multer().single("media");

module.exports = {
  registerPage: (req, res) => {
    return res.render("auth/register", {
      errors: { name: "", email: "", password: "" },
    });
  },

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // validasi
      const error = { errors: {} };
      if (!name) {
        error.errors.name = "name is required";
      }
      if (!email) {
        error.errors.email = "email is required";
      }
      if (!password) {
        error.errors.password = "password is required";
      }
      if (!name || !email || !password) {
        return res.render("auth/register", error);
      }

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        error.errors.email = "email is already used!";
        return res.render("auth/register", error);
      }

      const hashPassword = await bcryp.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashPassword,
        role_id: 2,
      });

      return res.redirect("/login");
    } catch (error) {
      throw error;
    }
  },

  loginPage: (req, res) => {
    return res.render("auth/login", { errors: { email: "", password: "" } });
  },

  login: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),

  whoami: async (req, res) => {
    try {
      return res.render("auth/whoami", { user: req.user });
    } catch (error) {
      throw error;
    }
  },

  editPage: (req, res) => {
    const user = req.user;
    console.log(user);
    return res.render("auth/edit-profile", {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      errors: false,
    });
  },

  update: async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = req.user;

      const passwordCorrect = await bcryp.compare(password, user.password);
      if (!passwordCorrect) {
        return res.status(400).json({
          status: false,
          message: "credential is not valid!",
          data: null,
        });
      }

      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });
      const stringFile = req.file.buffer.toString("base64");

      User.update(
        { name: name, avatar: uploadFile.url },
        { where: { id: user.id } }
      );

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      res.set("Authorization", `Bearer ${token}`);
      return res.status(200).json({
        status: true,
        message: "upload image success!",
        data: {
          id: user1.id,
          name: user1.name,
          email: user1.email,
          avatar: user1.avatar,
        },
      });
    } catch (err) {
      throw err;
    }
  },
};
