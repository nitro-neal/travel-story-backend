var router = require("express").Router();
var mongoose = require("mongoose");
var Trip = mongoose.model("Trip");
var User = mongoose.model("User");
var auth = require("../auth");

router.post("/", auth.required, function(req, res, next) {
  console.log(req.payload);
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      var trip = new Trip(req.body.trip);
      trip.slugify();

      trip.author = user;

      let userTrips = user.trips;
      userTrips.push(trip);
      user.trips = userTrips;

      let userTripSlugs = user.tripSlugs;

      if (userTripSlugs === null || userTripSlugs === undefined) {
        userTripSlugs = [];
      }

      console.log("trip slug!");
      console.log(trip.slug);
      userTripSlugs.push(trip.slug);
      user.tripSlugs = userTripSlugs;

      user.save();

      return trip.save().then(function() {
        console.log(trip.author);
        return res.json({ trip: trip.toJSONFor(user) });
      });
    })
    .catch(next);
});

router.get("/", function(req, res, next) {
  console.log("trip id..");
  console.log(req.query.tripid);
  console.log(req.query.tripid[0]);
  Trip.findOne({ slug: req.query.tripid })
    .then(function(trip) {
      if (!trip) {
        return res.sendStatus(404);
      }

      return res.json({ trip: trip });
    })
    .catch(next);
});

module.exports = router;
