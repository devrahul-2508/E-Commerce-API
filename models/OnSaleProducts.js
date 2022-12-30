const mongoose = require("mongoose");
const { Schema } = mongoose;

const OnSaleProductsSchema = new mongoose.Schema({
        products: [{type: Schema.Types.ObjectId, ref: "Product"}]

})

module.exports = mongoose.model("OnSaleProduct",OnSaleProductsSchema)