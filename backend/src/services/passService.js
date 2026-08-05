const Pass = require("../models/Pass");
const QRCode = require('qrcode');
const Visitor = require("../models/Visitor");
const Appointment = require("../models/Appointment");


exports.createPass = async (passData) => {
    const pass = await Pass.create({
        ...passData,
      
        status:"Active"
    });


    //data store in qrcode


    const qrData = JSON.stringify({
        passNumber:pass.passNumber,
        visitorId: pass.visitor,
        appointmentId:pass.appointment
    });


    //generate QRcode

    const qrcode = await QRCode.toDataURL(qrData);

    pass.qrCode = qrcode;
    await pass.save();

    return pass;
};


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


//verify the QR Code 

exports.verifyPass = async(passNumber)=>{
    console.log("verifyPass is called with:",passNumber);
   const pass = await Pass.findOne({ passNumber })
   .populate('visitor')
   .populate("appointment")
   .populate("createdBy","name email");

   if(!pass){
    throw new Error("Pass not found")
   }

   if(pass.status!=="Active"){
    throw new Error("Pass is not active")
   }

   if(new Date()>pass.expiryAt){
    throw new Error("Pass has expired")
   }

   return pass
}