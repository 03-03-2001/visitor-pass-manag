const CheakLog = require("../models/cheakLogModel");
const Pass = require("../models/Pass");


exports.createCheakIn = async (passNumber,securityOfficer) => {
   const pass = await Pass.findOne({passNumber}).populate("visitor");

   if(!pass){
    throw new Error ("Pass not Found")
   }

      if (pass.status !== "Active") {
        throw new Error("Pass is not active");
    }
    if(new Date()>pass.expiryAt){
        throw new Error("Pass are expired");
        
    }

    const existingLog = await CheakLog.findOne({
        pass:pass._id,
        cheakOutTime:null
    });
    if(existingLog){
        throw new Error("Visitor is Already CheakIn");
    }

    const cheakLog = await CheakLog.create({
        pass:pass._id,
        visitor: pass.visitor._id,
        securityOfficer,
        cheakInTime:new Date()

    });

    pass.status = "Checked-In",
    await pass.save();

    return cheakLog;
};


//cheakOut

exports.createCheakOut = async(passNumber)=>{
     const pass = await Pass.findOne({passNumber});

     if(!pass){
        throw new Error("Pass Not Found")
     }

     const cheakLog = await CheakLog.findOne({
        pass: pass._id,
        cheakOutTime:null
     });
     if(!cheakLog){
        throw new Error("Visitor not a cheaked in");
     }
     
     cheakLog.cheakOutTime = new Date();
     await cheakLog.save();

     pass.status = "Checked-Out"
     await pass.save();

     return cheakLog

}


exports.getAllPasses = async () => {
    return await Pass.find()
        .populate("visitor", "fullName email phone")
        .populate("appointment")
        .populate("createdBy", "name email role")
};






exports.getPassById = async (id) => {
    return await Pass.findById(id)
        .populate("visitor", "fullName email phone")
        .populate("appointment")
        .populate("createdBy", "name email role");
};


exports.updatePass = async (id, passData) => {
    return await Pass.findByIdAndUpdate(id, passData, {
        new: true,
        runValidators: true,
    });
};


exports.deletePass = async (id) => {
    return await Pass.findByIdAndDelete(id);
};






exports.searchPass = async (keyword) => {
    return await Pass.find({
        $or: [
            { passNumber: { $regex: keyword, $options: "i" } },
            { status: { $regex: keyword, $options: "i" } }
        ],
    })
        .populate("visitor", "fullName email phone")
        .populate("appointment")
        .populate("createdBy", "name email role")
}

exports.getPassByNumber = async (passNumber) => {
    return await Pass.findOne({ passNumber })
        .populate("visitor", "fullName email,phone")
        .populate("appointment")
        .populate("createdBy", "name email role")
};
//get Active Passes
exports.getActivePasses = async () => {
    return await Pass.find({ status: "Active" })
        .populate("visitor", "fullName email phone")
        .populate("appointment")
        .populate("createdBy", "name email role")
};


//get expired Passes

exports.getExpiredPasses = async () => {
    return await Pass.find({ status: "Expired" })
        .populate("visitor", "fullName email phone")
        .populate("appointment")
        .populate("createdBy", "name email role")
}