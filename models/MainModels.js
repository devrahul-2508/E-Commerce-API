const mongoose = require("mongoose");
const { Schema } = mongoose

const MainModelSchema = new mongoose.Schema({
    viewType:String,
    viewName: String,
    topSellingProductModel: {type: Schema.Types.ObjectId,ref:"TopSellingProducts"},
    trendingProductModel:  {type: Schema.Types.ObjectId,ref:"TrendingProduct"}
   
})

module.exports = mongoose.model("MainModels",MainModelSchema)