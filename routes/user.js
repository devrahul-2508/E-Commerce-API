const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthentication, verifyTokenAndAdmin } = require("./verifyToken")
const User = require("../models/User")

//UPDATE USER
router.put("/:id",verifyTokenAndAuthentication,async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE USER
router.delete("/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER

router.get("/find/:id",verifyTokenAndAdmin,async (req,res)=>{
    try{
        await User.findById(req.params.id)
        res.status(200).json({
            "User": User
        })
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router