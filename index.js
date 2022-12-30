require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const mainModelRoute = require("./routes/mainModels")
const uploadRoute = require("./middleware/imageUpload")
const fileUpload = require("express-fileupload")
const path = require("path");


app.use(express.json());
app.use(fileUpload({
    debug:true,
    useTempFiles:true,
    tempFileDir:path.join(__dirname,"./tmp")
}))

app.get("/test",(req,res)=>{
    res.send("Hello World")
})



mongoose.connect("mongodb://localhost:27017/shopDB");
app.use("/uploads",express.static("uploads"));
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);
app.use("/api/mainModels",mainModelRoute)





app.listen(3000, ()=>{
    console.log("Server started at port 3000");
});