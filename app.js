var http = require("http"),
  path = require("path"),
  methods = require("methods"),
  express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  cors = require("cors"),
  passport = require("passport"),
  errorhandler = require("errorhandler"),
  mongoose = require("mongoose");

require("dotenv").config();
// Create global app object
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "travel-story",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

mongoose.connect(process.env.MONGODB_URI);

require("./models/User");
require("./models/Trip");
require("./models/Itenerary");
require("./config/passport");

app.use(require("./routes"));

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

/// error handlers

// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
  console.log(err.stack);

  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err
    }
  });
});

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.json({
//     errors: {
//       message: err.message,
//       error: {}
//     }
//   });
// });

// finally, let's start our server...
var server = app.listen(process.env.PORT || 5000, function() {
  console.log("Listening on port " + server.address().port);
});
