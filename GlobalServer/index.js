const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./model/users");
const { toast } = require("react-toastify");
const CartModel = require("./model/CartModel");
const stripe = require("stripe")(
  "sk_test_51OGy2xSCMQu8LsRZK4hmg1Cz3YCIWSCOG38mzizqGYTj52sWM0uVJwPfLlgijfVinWCq9nM0xdDdlggnzzZEBuxk00AHP9sj5T"
);


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

app.get("/:uid/dashboard", (req, res) => {
  const { uid } = req.params;
  userModel
    .find({ uid })
    .then(function (user) {
      res.json(user);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/:uid/home", async (req, res) => {
  const { uid } = req.params;

  const YOUR_DOMAIN = `http://localhost:5173/${uid}/home` // Change this to your actual domain
  try {
    const product = req.body.products;

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr", // Change this to your currency
            product_data: {
              name: product.prodName,
              description: product.desc,
              images: [product.imgSrc],
            },
            unit_amount: product.price * 100, // Stripe expects the amount in cents
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`, // Redirect URL after successful payment
      cancel_url: `${YOUR_DOMAIN}?cancel=true`, // Redirect URL if payment is cancelled
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

app.post("/:uid/home/productDetails", async (req, res) => {
  const { uid } = req.params;
  const { ProductUID } = req.body;

  try {
    // Check if the product already exists in the user's cart
    const existingCartItem = await CartModel.findOne({ uid, ProductUID });

    if (existingCartItem) {
      // If the product exists, update its quantity
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      res.json({ message: "Product quantity updated successfully" });
    } else {
      // If the product doesn't exist, add it to the cart
      const cartItem = new CartModel({ uid, ProductUID, quantity: 1 });
      await cartItem.save();
      res.json({ message: "Product added to cart successfully" });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});


app.get("/:uid/home/productDetails", (req, res) => {
  const { uid } = req.params;
  CartModel
    .find({
      uid
    })
    .then(function (cart) {
      res.json(cart);
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

app.post("/:uid/home/productDetails/cart", async (req, res) => {
  const { productIds } = req.body; // Assuming productIds is an array of product IDs
  try {
    // Find products by their IDs
    const products = await userModel.find({
      _id: productIds // Find products where the ID is in the productIds array
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

app.listen(3001, () => { 
  console.log("server listening");
});
