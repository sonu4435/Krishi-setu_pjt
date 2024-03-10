const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  uid: String,
  ProductUID: String,
  quantity: { type: Number, default: 1 }, // Include quantity field
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
