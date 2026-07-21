const mongoose = require("mongoose");
const Visitor = require("./Visitor");
const { type } = require("node:os");

const appointmentSchema = new  mongoose.Schema({
    Visitor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Visitor",
        required:true
    },
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    visitDate:{
        type:Date,
        required:true
    },
    purpose:{
        type:String,
        required:true,
        trim:true
    } ,
    status:{
        type:String,
        enum:['Pending','Approved','Rejected','Completed'],
        default:'Pending'
    } ,
    remarks:{
        type:String,
        trim:true,
        default:""
    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null
    }  ,
    approvedAt:{
        type:Date,
        default:null
    },
},
{timestamps:true}
)

module.exports = mongoose.model("Appointment",appointmentSchema);