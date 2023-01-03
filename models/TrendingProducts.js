const mongoose = require("mongoose");
const { Schema } = mongoose;

const TrendingProductsSchema = new mongoose.Schema({
    products: [{type: Schema.Types.ObjectId, ref: "Product"}]
})

module.exports = mongoose.model("TrendingProduct", TrendingProductsSchema);