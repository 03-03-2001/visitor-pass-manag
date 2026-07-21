const Visitor = require("../models/Visitor");


exports.createVisitor = async (visitorData) => {
  return await Visitor.create(visitorData);
};


exports.getAllVisitors = async () => {
  return await Visitor.find().populate("createdBy", "name email role");
};


exports.getVisitorById = async (id) => {
  return await Visitor.findById(id).populate("createdBy", "name email role");
};


exports.updateVisitor = async (id, visitorData) => {
  return await Visitor.findByIdAndUpdate(id, visitorData, {
    new: true,
    runValidators: true,
  });
};


exports.deleteVisitor = async (id) => {
  return await Visitor.findByIdAndDelete(id);
};

 exports. searchVisitor = async (keyword) => {
  return await Visitor.find({
    $or: [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
      { address: { $regex: keyword, $options: "i" } },
      { company: { $regex: keyword, $options: "i" } },
    ]
  })
}