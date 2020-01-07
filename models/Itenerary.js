var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ItenerarySchema = new mongoose.Schema(
  {
    time: Date,
    location: String,
    description: String,
    blurb: String,
    photos: String,
    cost: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" }
  },
  { timestamps: true },
  { usePushEach: true }
);

// var mongoose = require("mongoose");
// var uniqueValidator = require("mongoose-unique-validator");
// var slug = require("slug");
// var User = mongoose.model("User");

// var ItenerarySchema = new mongoose.Schema(
//   {
//     time: Date,
//     location: String,
//     description: String,
//     blurb: String,
//     photos: String,
//     cost: String,
//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     tripParent: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" }
//   },
//   { timestamps: true }
// );

mongoose.model("Itenerary", ItenerarySchema);
