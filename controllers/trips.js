const Trip = require("../models/Trip");
const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    const trips = await Trip.find({});
    trips.reverse();
    res.status(200).json(trips);
  },

  getBySlug: async (req, res, next) => {
    const trip = await Trip.findOne({ slug: req.params.slugId });
    res.status(200).json(trip);
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
