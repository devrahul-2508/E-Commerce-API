const mongoose = require("mongoose");
const { Schema } = mongoose;


const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId, ref: "Product"
        },
        title: String,
        desc: String,
        img: String,
        price: Number,
       quantity: {
          type: Number,
          default: 1,
        },

      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);