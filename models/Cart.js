const mongoose = require("mongoose");
const Product = require("./Product.js");
const { Schema } = mongoose;


const CartSchema = new mongoose.Schema(
  {
    userId:{
      type:String,
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId, ref: "Product",
        },
        title: String,
        desc: String,
        img: String,
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number
      },
    ],
    productby:{
      type: Schema.Types.ObjectId, ref: "Product",

    },
    bill: {
      type: Number,
      required: true,
     default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);