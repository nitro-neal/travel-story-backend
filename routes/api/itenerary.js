var router = require("express").Router();
var mongoose = require("mongoose");
var Trip = mongoose.model("Trip");
var Itenerary = mongoose.model("Itenerary");
var User = mongoose.model("User");
var auth = require("../auth");

router.post("/", auth.required, function(req, res, next) {
  console.log(req.payload);
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }

      var itenerary = new Itenerary(req.body.itenerary);

      itenerary.author = user;
      // itenerary.trip =

      return itenerary.save().then(function() {
        console.log(itenerary.author);
        return res.json({ itenerary: itenerary });
      });
    })
    .catch(next);
});

// router.get("/:tripId", function(req, res, next) {
//   Itenerary.find({ trip: req.params.tripId }, function(err, iteneraries) {
//     res.send(iteneraries);
//   });
// });

router.get("/:iteneryId", function(req, res, next) {
  Itenerary.find({ itenerary: req.params.itenerary }, function(
    err,
    iteneraries
  ) {
    res.send(iteneraries);
  });
});

// router.get("/:userId", function(req, res, next) {
//   Itenerary.find({ user: req.params.userId }, function(err, iteneraries) {
//     res.send(iteneraries);
//   });
// });

// router.post("/", auth.required, function(req, res, next) {
//   console.log(req.payload);
//   User.findById(req.payload.id)
//     .then(function(user) {
//       if (!user) {
//         return res.sendStatus(401);
//       }

//       var itenerary = new Itenerary(req.body.Itenerary);

//       itenerary.author = user;

//       return trip.save().then(function() {
//         console.log(trip.author);
//         return res.json({ trip: trip.toJSONFor(user) });
//       });
//     })
//     .catch(next);
// });

// // return a trip
// // router.get("/:trip", auth.optional, function(req, res, next) {
// //   Promise.all([
// //     req.payload ? User.findById(req.payload.id) : null,
// //     req.trip.populate("author").execPopulate()
// //   ])
// //     .then(function(results) {
// //       var user = results[0];

// //       return res.json({ trip: req.trip.toJSONFor(user) });
// //     })
// //     .catch(next);
// // });

// router.get("/trip", auth.optional, function(req, res, next) {
//   return res.json({ trip: hi });
// });

module.exports = router;
