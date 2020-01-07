var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var slug = require("slug");
var User = mongoose.model("User");

var TripSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    title: String,
    description: String,
    body: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true },
  { usePushEach: true }
);

// TripSchema.plugin(uniqueValidator, { message: "is already taken" });

TripSchema.pre("validate", function(next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

TripSchema.methods.slugify = function() {
  this.slug =
    slug(this.title) +
    "-" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};

TripSchema.methods.updateFavoriteCount = function() {
  var trip = this;

  return User.count({ favorites: { $in: [trip._id] } }).then(function(count) {
    trip.favoritesCount = count;

    return trip.save();
  });
};

TripSchema.methods.toJSONFor = function(user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  };
};

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
