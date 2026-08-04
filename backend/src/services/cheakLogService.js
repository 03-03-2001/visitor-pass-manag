const CheakLog = require("../models/cheakLogModel");
const Pass = require("../models/Pass");


exports.createCheakIn = async (passNumber,securityOfficer) => {
   const pass = await Pass.findOne({passNumber});


    console.log("PASS =", pass);
    console.log("VISITOR =", pass?.visitor);
    console.log("SECURITY =", securityOfficer);

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
        visitor: pass.visitor,
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


exports.getAllCheakLogs = async () => {
    return await CheakLog.find()
        .populate("pass")
        .populate("visitor")
        .populate("securityOfficer", "name email")
        sort({createdAt:-1})
};






exports.getCheakLogById = async (id) => {
    return await CheakLog.findById(id)
        .populate("pass")
        .populate("visitor")
        .populate("securityStaff", "name email");
};


exports.updateCheakLog = async (id, data) => {
    return await CheakLog.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
    .populate("pass")
    .populate("visitor")
    .populate("securityStaff","name email")
};


exports.deleteCheakLog = async (id) => {
    return await CheakLog.findByIdAndDelete(id);
};






exports.searchCheakLogs = async (keyword) => {
    return await CheakLog.find({
        $or: [
            { status: { $regex: keyword, $options: "i" } },
            { remarks: { $regex: keyword, $options: "i" } }
        ],
    })
        .populate("pass")
        .populate("visitor")
        .populate("securityStaff", "name email")
}


exports.getTodayLogs = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    console.log("start",start);
    console.log("end",end);

    return await CheakLog.find({
        cheakInTime: {
            $gte: start,
            $lte: end
        },
         
                cheakOutTime: {
                    $gte: start,
                    $lte: end
                }
            
    })
    .populate("pass")
    .populate("visitor")
    .populate("securityOfficer", "name email")
    .sort({ cheakInTime: -1 });
};


//cheakIn

exports.cheakInVisitor = async(passId,securityStaffId)=>{
        const pass = await Pass.findById({passId})

        if(!pass){
            throw new Error("Pass not found")
        }

        if(pass.status === "Checked-In"){
            throw new Error("visitor already cheaked-in");
        }

        pass.status = "Checked-In"
        await pass.save();

        return cheakLog.create({
            pass:pass._id,
            visitor:pass.visitor,
            securityStaff: securityStaffId,
            cheakInTime:new Date(),
            status:"Cheaked-In"

        })
}


exports.cheakOutVisitor = async(passId)=>{
      const pass = await Pass.findById(passId);

      if(!pass){
        throw new Error("Pass not found")
      }

      const log = await CheakLog.findOne({
        pass:passId,
        status:"Cheaked-In"
      });

      if(!log){
        throw new Error("Cheak-In record not found")
      }

      log.cheakOutTime = new Date();
      log.status = "Cheaked-Out";
      await log.save();


      pass.status = "Cheaked-Out";
      await pass.save();

      return log;

}







