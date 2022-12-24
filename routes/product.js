const Product = require("../models/Product");

const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const upload = require("../middleware/imageUpload");
const TrendingProducts = require("../models/TrendingProducts");
const TopSellingProducts = require("../models/TopSellingProducts");
const MainModels = require("../models/MainModels");
const router = require("express").Router();

//CREATE PRODUCT

router.post("/",verifyTokenAndAdmin,upload.single('img'), async(req,res)=>{
    const newProduct = new Product({
      title : req.body.title,
      desc: req.body.desc,
      categories:req.body.categories,
      size:req.body.size,
      color:req.body.color,
      price:req.body.price
    })

    try{

        if (req.file) {
          console.log(req.file);
          newProduct.img = "http://localhost:3000/uploads/"+req.file.filename
        }


        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

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


  router.get("/mainmodels",async function(req,res){

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
      }
     ]
      
     
   )
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
