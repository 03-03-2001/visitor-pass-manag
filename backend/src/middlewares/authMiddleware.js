const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = async(req,res,next)=>{
       try {
            const authHeader = req.header.authorization;
            if(!authHeader || authHeader.startWith("Bearer")){
                return res.status(401).json({
                    success:false,
                    message:"Access is Denied, no token provide"
                })
            };
            const token = authHeader.split(" ")[1];


            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");

            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"User Not Found"
                })
            };

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