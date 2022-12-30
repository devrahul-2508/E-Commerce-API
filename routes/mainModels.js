const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const router = require("express").Router();
const MainModels = require("../models/MainModels");
const TrendingProducts = require("../models/TrendingProducts");
const TopSellingProducts = require("../models/TopSellingProducts");
const OnSaleProduct = require("../models/OnSaleProducts")



router.post("/tp",async function(req,res){
    const newTrendingProduct = new TrendingProducts(req.body);

    try{
      let result = await newTrendingProduct.save()
      res.json({
        "success": true,
        "code": 200,
        "message": "Successfully added",
        "response": result
      })
    }
    catch(err){
      console.log(err);
    }

    
  })


  router.get("/tp",async function(req,res){
    let products = await TrendingProducts.find().populate('products');
    console.log(products);

    res.json({
      "success": true,
      "code": 200,
      "message": "Successfully added",
      "response": products
    })

  })

  router.post("/ts",async function(req,res){
    const newTopSellingProduct = new TopSellingProducts(req.body);

    try{
      let result = await newTopSellingProduct.save()
      res.json({
        "success": true,
        "code": 200,
        "message": "Successfully added",
        "response": result
      })
    }
    catch(err){
      console.log(err);
    }

    
  })

  router.post("/os",async function(req,res){
    const newOnSaleProducts = new OnSaleProduct(req.body);

    try{
      let result = await newOnSaleProducts.save()
      res.json({
        "success": true,
        "code": 200,
        "message": "Successfully added",
        "response": result
      })
    }
    catch(err){
      console.log(err);
    }

    
  })


  router.get("/ts",async function(req,res){
    let products = await TopSellingProducts.find().populate('products');
    console.log(products);

    res.json({
      "success": true,
      "code": 200,
      "message": "Successfully added",
      "response": products
    })

  })


  router.get("/",async function(req,res){
    const page = req.query.page
    try{

      let models = await MainModels.find().populate(
     [
      {        
       path: 'topSellingProductModel',
       populate: {
         path: 'products',
         model: 'Product'
     } 
      },
      {
       path: 'trendingProductModel',
       populate: {
         path: 'products',
         model: 'Product'
     } 
      },
      {
        path:'onSaleProductModel',
        populate: {
            path: 'products',
            model: 'Product'
          } 

      }
     ]
      
    
   )
   const limit = 3;
   const startIndex = (page-1) * limit;
   const endIndex = page * limit

   models = models.slice(startIndex,endIndex)
    res.json({
      "success": true,
      "code": 200,
      "message": "Successfully fetched",
      "response": models
    })

  }catch(err){
    console.log(err);
  }
})



    
    


module.exports = router
