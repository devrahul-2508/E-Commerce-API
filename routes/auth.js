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
        let savedUser = await newUser.save();

        const accessToken = jwt.sign({
         id: savedUser._id,
         isAdmin: savedUser.isAdmin
       },process.env.JWT_SEC
      
       );

       savedUser = savedUser.toObject();
       savedUser.accessToken = accessToken;
       delete savedUser.password;



        res.json({
         "success": true,
         "code": 200,
         "message": "Successfully Registered new User",
         "response": savedUser
        })

    }
    catch(err){
      console.log(err);
      res.json({
         "success": false,
         "code": 500,
         "message": err,
         "response": null
       })
    }

    
 });

 //LOGIN
 router.post("/login", async(req,res)=>{
    try{
     
     var user = await User.findOne({email: req.body.email});

     

       if(!user){
        res.json({
         "success": false,
         "code": 501,
         "message": "Wrong Credentials",
         "response": null
        });
       }
       else{
         
       

       const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
       console.log(hashedPassword);

      
      

       if(hashedPassword == req.body.password){

         const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
          },process.env.JWT_SEC,
          {expiresIn: "3d"}
          );

      //   const {password, ...others} = user._doc;
      //   res.status(201).json({...others,accessToken});
      user = user.toObject();
      user.accessToken = accessToken;
      delete user.password;
      console.log(user);
        res.json({
         "success": true,
         "code":201,
         "message": "Successfully signed in",
         "response": user
        })
       }
       else{
        res.json({
         "success": false,
         "code": 501,
         "message": "Wrong Password",
         "response": null
        });
       }
    }
   }
    catch(err){
      console.log(err);
    }
 })


module.exports = router
