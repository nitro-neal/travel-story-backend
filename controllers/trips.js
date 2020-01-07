const Trip = require("../models/Trip");
const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    const trips = await Trip.find({});
    res.status(200).json(trips);
  },

  newTrip: async (req, res, next) => {
    const user = await User.findById(req.payload.id);

    if (!user) {
      return res.sendStatus(401);
    }

    var newTrip = new Trip(req.body.trip);
    newTrip.slugify();
    newTrip.author = user;
    await newTrip.save();

    user.trips.push(newTrip);
    user.tripSlugs.push(newTrip.slug);
    await user.save();

    return res.status(201).json({ newTrip });
  }
};
