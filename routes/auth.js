const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//REGISTER

 router.post("/register",async(req,res)=>{
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
       res.status(501).json(err);
    }

    
 });

 //LOGIN
 router.post("/login", async(req,res)=>{
    try{
       
       const user = await User.findOne({username: req.body.username});
       if(!user){
        res.status(401).json("Wrong crdentials");
       }

       const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
       console.log(hashedPassword);

      
      

       if(hashedPassword == req.body.password){

         const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
          },process.env.JWT_SEC,
          {expiresIn: "3d"}
          );

        const {password, ...others} = user._doc;
        res.status(201).json({...others,accessToken});
       }
       else{
        res.status(501).json("Incorrct password");
       }
    }
    catch(err){

    }
 })


module.exports = router
