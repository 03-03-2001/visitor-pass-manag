const mongoose = require('mongoose');
const { timeStamp } = require('node:console');
const { type } = require('node:os');

const userSchema = new  mongoose.Schema({
   name:{
    type:String,
    require:true,
    trim:true
   },
   email:{
    type:String,
    require:true,
    unique:true,
    lowerCase:true
   },
   password:{
    type:String,
    require:true,
    minLength:6
   },
   role:{
    type : String,
    enum:["admin","security","employee"],
    default:"employee"
   },
   department:{
    type:String
   },
   phone:{
    type:String
   },
}, {timeStamp:true});


module.exports = mongoose.model("User", userSchema);