const mongoose = require('mongoose')
const { Schema } = mongoose;

const TopSellingProductsSchema = new mongoose.Schema({
    products: [{type: Schema.Types.ObjectId, ref: "Product"}]
})
module.exports = mongoose.model("TopSellingProducts",TopSellingProductsSchema);
