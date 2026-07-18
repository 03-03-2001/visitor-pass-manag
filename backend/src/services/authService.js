const User = require('../models/User');
const authMiddleware = require("../middlewares/authMiddleware");

const getUserByEmail = async(email)=>{
   return await User.findOne(email);   
}

const createUser = async(userData)=>{
    return await User.create(userData)
}

const getUserById = async (id)=>{
   return await User.findById(id).select("-password");
}


module.exports={
    getUserByEmail,
    createUser,
    getUserById
}