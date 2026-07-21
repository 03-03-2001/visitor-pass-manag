const Appointment = require("../models/Appointment");


exports.createAppointment = async (appointmentData) => {
    return await Appointment.create(appointmentData);
};


exports.getAllAppointments = async () => {
    return await Appointment.find()
        .populate("visitor")
        .populate("employee", "name email")
        .populate("approvedBy", "name email role")
};


exports.getAppointmentById = async (id) => {
    return await Appointment.findById(id)
        .populate("visitor")
        .populate("employee", "name email")
        .populate("approvedBy", "name email role")
};


exports.updateAppointment = async (id, appointmentData) => {
    return await Appointment.findByIdAndUpdate(id, appointmentData, {
        new: true,
        runValidators: true,
    });
};


exports.deleteAppointment = async (id) => {
    return await Appointment.findByIdAndDelete(id);
};

exports.approvedAppointment = async (id, approvedBy) => {
    return await Appointment.findByIdAndUpdate(id, {
        status: "Approved",
        approvedBy,
        approvedAt: new Date()
    }, {
        new: true
    })
}


exports.rejectAppointment = async (id, remarks) => {
    return await Appointment.findByIdAndUpdate(id, {
        status: "Rejected",
        remarks,
    },
        {
            new: true
        }
    );
};

exports.searchAppointment = async (keyword) => {
    return await Appointment.find({
        $or: [
            { purpose: { $regex: keyword, $options: "i" } },
            { status: { $regex: keyword, $options: "i" } }
        ],
    })
    .populate("visitor")
    .populate("employee","name email")
}