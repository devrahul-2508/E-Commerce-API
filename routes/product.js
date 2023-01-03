const Product = require("../models/Product");

const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const upload = require("../middleware/imageUpload");
const cloudinary = require("../config/cloudinary.config")
const TrendingProducts = require("../models/TrendingProducts");
const TopSellingProducts = require("../models/TopSellingProducts");
const router = require("express").Router();
require('dotenv').config()
const fs = require("fs");

//CREATE PRODUCT

router.post("/",verifyTokenAndAdmin, async(req,res)=>{
    
  
  
  

    try{
const result = await cloudinary.uploader.upload(req.files.img.tempFilePath,{
        folder: 'ProductImages',
        // width:300,
        // crop:"scale"
      })


      const newProduct = new Product({
        title : req.body.title,
        desc: req.body.desc,
        categories:req.body.categories,
        size:req.body.size,
        color:req.body.color,
        price:req.body.price,
        img: result.url
      })

       


        const savedProduct = await newProduct.save();
        fs.unlink(req.files.img.tempFilePath,(err)=>{
          if(err){
            console.log(err);
          }
        })
        res.json({
          "success": true,
          "code": 200,
          "message": "Successfully Added Product",
          "response": savedProduct
         })

    }
    catch(err){
      console.log(err);
        res.status(500).json(err);

    }
})

//Update Product

router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
    
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
            $set: req.body
            },
            {new: true}
        )
        res.status(200).json(updatedProduct);

    }catch(err){
        res.status(500).json(err);

    }
    
    })

    //DELETE PRODUCT
    router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
        try{
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json("Product has been deleted...");

        }
        catch(err){
            res.status(500).json(err);
        }
    })

    //GET PRODUCT
    router.get("/find",async (req,res)=>{
        try{
            const product = await Product.findById(req.query.id);

            res.json({
              "success": true,
              "code": 200,
              "message": "Successfully Fetched Product",
              "response": product
             })
        }catch(err){

          res.json({
            "success": false,
            "code": 500,
            "message": "err",
            "response": null
           })

        }
    })

    //GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qTitle = req.query.title;
    const qCategory = req.query.category;
    const page = req.query.page
    try {
      let products;
      const limit = 2;

  
      if (qTitle) {
        

        products = await Product.find({title: { '$regex': qTitle, '$options': 'i' }}, {});


      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }

      const startIndex = (page-1) * limit;
      const endIndex = page * limit

      products = products.slice(startIndex,endIndex)


  
      res.json({
        "success": true,
        "code": 200,
        "message": "Successfully fetched all products",
        "response": products
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        "success": false,
        "code": 500,
        "message": err,
        "response": null
      });
    }
  });

  

    
    


module.exports = router
