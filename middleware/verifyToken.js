const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(authHeader){
        const token = authHeader.split(" ")[1]

        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                res.json({
                    "success": false,
                    "code": 500,
                    "message": "Token is not valid",
                    "response": null
                   })
            } 
            else{
                req.user = user;
                next();
            }


        })
    }else{

        res.json({
            "success": false,
            "code": 500,
            "message": "You are not authenticated",
            "response": null
           })

    }
}

const verifyTokenAndAuthentication = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.json({
            "success": false,
            "code": 500,
            "message": "You are not allowed to do that!",
            "response": null
           })
      }
    });
  };



const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.json({
                "success": false,
                "code": 500,
                "message": "You are not allowed to do that!",
                "response": null
               })
        }
    })
    }

module.exports = {verifyToken,verifyTokenAndAuthentication,verifyTokenAndAdmin}