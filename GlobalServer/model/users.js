const mongoose = require("mongoose");


  const userSchema = new mongoose.Schema({
    uid: String,
    foodname: String,
    foodprice: Number,
    foodquantity: Number,
    foodrating: Number,
    category: String,
    location: String,
    fileurl: {
      type: String,
    }
  });
  
  const userModel = mongoose.model("Farmers", userSchema);

  module.exports = userModel;
