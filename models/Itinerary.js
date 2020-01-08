var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ItinerarySchema = new mongoose.Schema(
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

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
