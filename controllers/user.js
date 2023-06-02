const { User } = require("../db/models");
const bcryp = require("bcrypt");
const passport = require("../utils/passport");
const imagekit = require("../utils/imagekit");
const multer = require("multer");
const upload = multer().single("media");
const oauth2 = require("../utils/oauth2");
const nodemailer = require("../utils/nodemailer");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

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

      const user = await User.create({
        name,
        email,
        password: hashPassword,
        role_id: 2,
      });

      const payload = {
        id: user.id,
      };
      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      const url = `${req.protocol}://${req.get(
        "host"
      )}/emailverify?token=${token}`;

      const html = await nodemailer.getHtml("emailverify.ejs", {
        name: user.name,
        url,
      });
      nodemailer.sendMail(user.email, "Verify Your Email", html);

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
      const { name } = req.body;
      const user = req.user;

      const stringFile = req.file.buffer.toString("base64");
      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      User.update(
        { name: name, avatar: uploadFile.url },
        { where: { id: user.id } }
      );

      return res.status(200).json({
        status: true,
        message: "upload image success!",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      throw err;
    }
  },
  googleOauth2: async (req, res) => {
    const { code } = req.query;
    if (!code) {
      const googleLoginUrl = oauth2.generateAuthUrl();
      return res.redirect(googleLoginUrl);
    }

    await oauth2.setCreadentials(code);
    const { data } = await oauth2.getUserData();

    try {
      let user = await User.findOne({ where: { email: data.email } });
      if (!user) {
        user = await User.create({
          name: data.name,
          email: data.email,
          user_type: "google",
          avatar: data.picture,
        });

        const payload = {
          id: user.id,
        };
        const token = await jwt.sign(payload, JWT_SECRET_KEY);
        const url = `${req.protocol}://${req.get(
          "host"
        )}/emailverify?token=${token}`;

        const html = await nodemailer.getHtml("emailverify.ejs", {
          name: user.name,
          url,
        });
        nodemailer.sendMail(user.email, "Verify Your Email", html);
      }

      req.login(user, (err) => {
        if (err) {
          return res.redirect("/login");
        }
        return res.redirect("/");
      });
    } catch (err) {
      return res.redirect("/login");
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.render("auth/verify-email", {
          message: "invalid token!",
          token,
        });
      }

      const data = await jwt.verify(token, JWT_SECRET_KEY);

      const updated = await User.update(
        { email_verify_at: Date.now() },
        { where: { id: data.id } }
      );
      return res.render("auth/verify-email", {
        message: null,
      });
    } catch (err) {
      throw err;
    }
  },
};
