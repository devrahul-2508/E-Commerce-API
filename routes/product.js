const Product = require("../models/Product");

const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken")
const router = require("express").Router();

//CREATE PRODUCT

router.post("/",verifyTokenAndAdmin, async(req,res)=>{
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    }
    catch(err){
        res.status(500).json(err);

    }
})


module.exports = router
