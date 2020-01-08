const User = require("../models/User");
const passport = require("passport");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json(users);
  },

  getAuthUserProfile: async (req, res, next) => {
    const user = await User.findById(req.payload.id);
    res.status(200).json({ user: user.toAuthJSON() });
  },

  updateUserProfile: async (req, res, next) => {
    const user = await User.findById(req.payload.id);
    res.status(200).json({ user: user.toAuthJSON() });

    // only update fields that were actually passed...
    if (typeof req.body.user.username !== "undefined") {
      user.username = req.body.user.username;
    }
    if (typeof req.body.user.email !== "undefined") {
      user.email = req.body.user.email;
    }
    if (typeof req.body.user.bio !== "undefined") {
      user.bio = req.body.user.bio;
    }
    if (typeof req.body.user.image !== "undefined") {
      user.image = req.body.user.image;
    }
    if (typeof req.body.user.password !== "undefined") {
      user.setPassword(req.body.user.password);
    }

    await user.save();

    return res.json({ user: user.toAuthJSON() });

    //   console.log("user updating");
    //   console.log(req.payload);
    //   User.findById(req.payload.id)
    //     .then(function(user) {
    //       if (!user) {
    //         return res.sendStatus(401);
    //       }

    //       // only update fields that were actually passed...
    //       if (typeof req.body.user.username !== "undefined") {
    //         user.username = req.body.user.username;
    //       }
    //       if (typeof req.body.user.email !== "undefined") {
    //         user.email = req.body.user.email;
    //       }
    //       if (typeof req.body.user.bio !== "undefined") {
    //         user.bio = req.body.user.bio;
    //       }
    //       if (typeof req.body.user.image !== "undefined") {
    //         user.image = req.body.user.image;
    //       }
    //       if (typeof req.body.user.password !== "undefined") {
    //         user.setPassword(req.body.user.password);
    //       }

    //       return user.save().then(function() {
    //         return res.json({ user: user.toAuthJSON() });
    //       });
    //     })
    //     .catch(next);
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
