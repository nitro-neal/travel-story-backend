var router = require("express").Router();
const UserController = require("../../controllers/users");
const TripController = require("../../controllers/trips");
var auth = require("../auth");

router
  .route("/users")
  .get(UserController.index)
  .post(UserController.newUser);

router.route("/users/login").post(UserController.login);

router.route("/users/:username").get(UserController.getUserByUsername);

router
  .route("/trips/")
  .get(TripController.index)
  .post(auth.required, TripController.newTrip);

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
