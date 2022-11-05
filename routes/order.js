const Order = require("../models/Order");
const User = require("../models/User")
const Product = require("../models/Product")
const {
  verifyToken,
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  try{

  const user = req.user.id;
  const {products,amount,address} = req.body

  let newProducts=[]
  var itemsProcessed = 0;
  products.forEach(product => {
  
   console.log(product.productId);
   Product.findById(product.productId,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
     const productId = result._id
     const title = result.title
     const desc = result.desc
     const img = result.img
     const quantity = product.quantity
     newProducts.push({productId,title,desc,img,quantity})

     itemsProcessed++;
     if(itemsProcessed === products.length) {
       callback();
     }
    
    }
   });
  async function callback(){
    const newOrder = await Order.create({
      userId: user,
      products: newProducts,
      amount: amount,
      address: address
    })

    console.log(newOrder);

  
    res.json({
      "success": true,
      "code":200,
      "message": "Successfully created order",
      "response": newOrder
    });
  }

  });

  

  


  
  }
  catch(err){
    console.log(err);
    res.json({
      "success": false,
      "code":500,
      "message": "Order creation failed",
      "response": null
    });
  }
  
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/", verifyToken, async (req, res) => {
    console.log(req.body._id);

    try{
      await Order.findOneAndDelete({_id:req.body._id});
      res.json({
        "success": true,
        "code":200,
        "message": "Successfully deleted order",
        "response": null
      });

    }catch(err){
      console.log(err);
      res.json({
        "success": false,
        "code":500,
        "message": "Order deletion failed",
        "response": null
      });
    }

   

      
   
  
});

//GET USER ORDERS
router.get("/find", verifyToken, async (req, res) => {
    try {
      const user = req.user.id;
      const orders = await Order.find({userId: user})
      res.json({
        "success": true,
        "code":200,
        "message": "Successfully fetched orders of user",
        "response": orders
      });
    } catch (err) {
      console.log(err);
      res.json({
        "success": false,
        "code":500,
        "message": "Orders cant be fetched",
        "response": null
      });
    }

    Order.find({userId: user})
.populate("productId")
.then(p=>console.log(p))
.catch(error=>console.log(error));
    
    
  });

  // GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });






  module.exports = router