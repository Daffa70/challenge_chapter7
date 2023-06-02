const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../db/models");
const bcrypt = require("bcrypt");

async function authenticateGoogle(email, done) {
  try {
    const user = await User.findOne({ where: { email } });

    return done(null, user);
  } catch (err) {
    return done(null, false, { message: err.message });
  }
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    authenticateGoogle
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  return done(null, await User.findOne({ where: { id } }));
});

module.exports = passport;
