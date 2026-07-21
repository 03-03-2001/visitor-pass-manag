
const roleMiddleware=(...roles)=>{
    return(req,res,next)=>{
        if(!req.user){
          return res.status(401).json({
                success:false,
                message:"Unauthorized, please Login first"
            });
        };

        if(!roles.includes(req.user.role)){
           return res.status(403).json({
                success:false,
                message:"Access Denied, You are not authorized to perform in thise action"
            });
        }
        next();
    };
};

module.exports = roleMiddleware;
