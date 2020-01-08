var router = require("express").Router();
const UserController = require("../../controllers/users");
const TripController = require("../../controllers/trips");
const ItineraryController = require("../../controllers/itineraries");
var auth = require("../auth");

router
  .route("/users")
  .get(UserController.index)
  .post(UserController.newUser);

// used for own user profile screen
router
  .route("/user")
  .get(auth.required, UserController.getAuthUserProfile)
  .put(auth.required, UserController.updateUserProfile);

router.route("/users/login").post(UserController.login);

router.route("/users/:username").get(UserController.getUserByUsername);

router
  .route("/trips/")
  .get(TripController.index)
  .post(auth.required, TripController.newTrip);

router.route("/trips/:slugId").get(TripController.getBySlug);

router
  .route("/itineraries/")
  .get(ItineraryController.index)
  .post(auth.required, ItineraryController.newItinerary);

router.use(function(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
