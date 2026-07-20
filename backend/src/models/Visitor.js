const mongoose = require("mongoose");


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
        type:String
     },
     photo:{
        type:String,
        default:""
     },
     idProof:{
        type:String,
        default:""
     },
     createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },

},{
    timestamps:true
}
);


module.exports = mongoose.model("Visitor", visitorSchema)