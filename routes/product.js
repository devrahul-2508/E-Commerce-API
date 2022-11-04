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
