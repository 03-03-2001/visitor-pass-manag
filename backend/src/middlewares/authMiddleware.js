const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = async(req,res,next)=>{
       try {
            const authHeader = req.headers.authorization;
            if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({
                    success:false,
                    message:"Access is Denied, no token provide"
                })
            };
            const token = authHeader.split(" ")[1];
            console.log("Token",token);
          
             
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log("Decoded",decoded);

            const user = await User.findById(decoded.id).select("-password");
            console.log("User",user);

            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"User Not Found"
                })
            };
              console.log(req.user);
            req.user = user
            next();

       } catch (error) {
           return res.status(401).json({
            success:false,
            message:"Error Message or Invalid Token.", 
            error: error.message
           })
       }
}

module.exports = authMiddleware;