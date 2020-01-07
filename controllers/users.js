const User = require("../models/User");
const passport = require("passport");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json(users);
  },

  newUser: async (req, res, next) => {
    const newUser = new User();
    newUser.username = req.body.user.username;
    newUser.email = req.body.user.email;
    newUser.setPassword(req.body.user.password);

    const user = await newUser.save();
    return res.status(201).json({ user: user.toAuthJSON() });
  },

  getUserByUsername: async (req, res, next) => {
    console.log(req.params);
    const user = await User.find({ username: req.params.username });
    res.status(200).json(user);
  },

  login: async (req, res, next) => {
    if (!req.body.user.email) {
      return res.status(422).json({ errors: { email: "can't be blank" } });
    }

    if (!req.body.user.password) {
      return res.status(422).json({ errors: { password: "can't be blank" } });
    }

    passport.authenticate("local", { session: false }, function(
      err,
      user,
      info
    ) {
      if (err) {
        console.log("PASSPORT ERROR");
        return next(err);
      }

      if (user) {
        console.log("User Login!");
        user.token = user.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(422).json(info);
      }
    })(req, res, next);
  }
};
