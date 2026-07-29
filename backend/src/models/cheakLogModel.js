const mongoose = require("mongoose");
const { type } = require("node:os");

const cheakLogSchema = new mongoose.Schema({
    pass:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pass",
        required:true
    },
    visitor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Visitor",
        required:true
    },
    securityOfficer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    cheakInTime:{
        type:Date,
    },
    cheakOutTime:{
        type:Date
    },

},{timestamps:true});


module.exports = mongoose.model("CheakLog",cheakLogSchema);