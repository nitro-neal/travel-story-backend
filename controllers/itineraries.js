const Trip = require("../models/Trip");
const Itinerary = require("../models/Itinerary");
const User = require("../models/User");

module.exports = {
  index: async (req, res, next) => {
    const itineraries = await itinerary.find({});
    res.status(200).json(itineraries);
  },

  newItinerary: async (req, res, next) => {
    const user = await User.findById(req.payload.id);
    const tripId = req.body.trip.id;
    const trip = await Trip.findById(tripId);

    console.log(trip);

    var itinerary = new Itinerary(req.body.itinerary);

    itinerary.user = user;
    itinerary.trip = trip;
    await itinerary.save();

    trip.itineraries.push(itinerary);
    await trip.save();

    return res.status(201).json({ itinerary });
  }
};
