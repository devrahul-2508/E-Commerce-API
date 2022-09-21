require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")

app.use(express.json());



mongoose.connect("mongodb://localhost:27017/shopDB");

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);


app.listen(3000, ()=>{
    console.log("Server started at port 3000");
});