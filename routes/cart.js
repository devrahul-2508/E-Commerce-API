const Cart = require("../models/Cart")
const Item = require("../models/Product")
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("../middleware/verifyToken")
const router = require("express").Router();



//add cart
router.post("/", verifyToken, async (req, res) => {
  
  try {
    const owner = req.user.id;
  console.log(owner);
  const { productId, quantity } = req.body;
  console.log(productId);
    const cart = await Cart.findOne({ userId: owner});
    const item = await Item.findOne({ _id: productId});

    console.log(cart);

    if (!owner) {
      res.json({
        "success": false,
        "code":500,
        "message": "User not found",
        "response": null
      });
      return
    }

    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    const price = item.price;
    const title = item.title;
    const img = item.img;
    const desc= item.desc;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.products.findIndex((item) => item.productId == productId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.products[itemIndex];
        product.quantity += quantity;

        cart.bill = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
        },0)

        if(product.quantity === 0){
          cart.products.splice(itemIndex,1)
        }
        else{
          cart.products[itemIndex] = product;
        }
        
       
        await cart.save();
        res.json({
          "success": true,
          "code":200,
          "message": " Successfully fetched cart of user",
          "response": cart
        });
      } else {
        cart.products.push({ productId, quantity, price,title,img,desc });
        cart.bill = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
        },0)

        await cart.save();
        res.json({
          "success": true,
          "code":200,
          "message": "Successfully fetched cart of user",
          "response": cart
        });
      }
    } else {
      //no cart exists, create one
      console.log(quantity*price);
      const newCart = await Cart.create({
        userId: owner,
        products: [{ productId,quantity, price,title,img,desc }],
        bill: quantity * price,
      });
      
      res.json({
        "success": true,
        "code":200,
        "message": "Successfully fetched cart of user",
        "response": newCart
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      "success": false,
      "code":500,
      "message": "Some error occured",
      "response": null
    });
  }
});

//UPDATE USER CART
router.put("/:id",verifyTokenAndAuthentication,async (req,res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
               
            },
            { new : true}
        );
        res.status(200).json(updatedCart);

    }
    catch(err){
        res.status(500).json(err);

    }
})



//DELETE
router.delete("/:id", verifyTokenAndAuthentication, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET USER CART
  router.get("/find", verifyToken, async (req, res) => {
   


      try {
        const owner = req.user.id;
        const cart = await Cart.findOne({ userId: owner });
        if (cart) {
          res.json({
            "success": true,
            "code":200,
            "message": " Successfully fetched cart of user",
            "response": cart
          });
        } else {
          res.json({
            "success": false,
            "code":500,
            "message": "Cart is Empty",
            "response": cart
          })
        }
      } catch (error) {
        res.json({
          "success": false,
          "code":500,
          "message": "Some error occured",
          "response": null
        });
      }
    });


    router.get("/findv1", verifyToken, async (req, res) => {
   


      try {
        const owner = req.user.id;
        const cart = await Cart.findOne({ owner }).populate('productby');
        if (cart && cart.products.length > 0) {
          res.json({
            "success": true,
            "code":200,
            "message": " Successfully fetched cart of user",
            "response": cart
          });
        } else {
          res.json({
            "success": true,
            "code":200,
            "message": "Cart is Empty",
            "response": cart
          })
        }
      } catch (error) {
        console.log(error);
        res.json({
          "success": false,
          "code":500,
          "message": "Some error occured",
          "response": null
        });
      }
    });


//GET ALL CARTS

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
  try{
    const carts = await Cart.find();
    res.status(200).json(carts);
  }
  catch(err){
    res.status(500).json(err);

  }
})

module.exports = router
