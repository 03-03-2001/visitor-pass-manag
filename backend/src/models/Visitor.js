const mongoose = require("mongoose");
const { type } = require("node:os");

const visitorSchema = new  mongoose.Schema({
     fullName:{
        type:String,
        require:true,
        trim:true
     },
     email:{
        type:String,
        trim:true,
        lowerCase:true
     },
     phone:{
        type:String,
        require:true
     },
     address:{
        type:String,
        require:true
     },
     company:{
        type:string
     },
     photo:{
        type:string,
        default:""
     },
     idProof:{
        type:string,
        default:""
     },
     createBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        require:true
     },

},{
    timestamps:true
}
);


module.exports = mongoose.model("Visitor", visitorSchema)