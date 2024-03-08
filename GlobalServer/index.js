const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./model/users");
const { toast } = require("react-toastify");

const app = express();
app.use(cors());
app.use(express.json());

try {
  mongoose.connect(
    "mongodb+srv://soumya:soumya@bug-busters.n6lkkkq.mongodb.net/Krishi-setu"
  );
} catch (error) {
  toast.error("Error while connecting to server");
  console.log(error);
}


 app.get("/:id/home", (req, res) => {
   userModel
     .find({})
     .then(function (user) {
       res.json(user);
     })
     .catch(function (err) {
       console.log(err);
     });
 });

 app.post("/:id/addproduct", async (req, res) => {
   let Farmer = new userModel(req.body);
   let result = await Farmer.save();
   res.send(result);
 });

  app.listen(3001, () => {
    console.log("server listening");
  });

