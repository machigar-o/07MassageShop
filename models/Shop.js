const mongoose = require("mongoose");
const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    priceLevel: {
      type: Number,
      enum: [1,2,3,4],
      default: 3,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postalcode cannot be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    picture: {
      type: String,
      required: [true, "Please add URL to shop picture"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Cascade delete bookings when a shop is deleted
ShopSchema.pre("remove", async function (next) {
  console.log(`Booking being removed from shop ${this._id}`);
  await this.model("Booking").deleteMany({ shop: this._id });
  next();
});
// Reverse populate with virtuals
ShopSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "shop",
  justOne: false,
});
module.exports = mongoose.model("Shop", ShopSchema);
