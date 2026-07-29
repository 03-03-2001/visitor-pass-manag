const Pass = require("../models/Pass");


exports.createPass = async (passData) => {
    return await Pass.create(passData);
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