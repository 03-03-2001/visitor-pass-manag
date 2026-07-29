const mongoose = require('mongoose');
const Visitor = require('./Visitor');
const Appointment = require('./Appointment');

const passSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor",
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    passNumber: {
        type: String,
        required: true,
        unique: true
    },
    qrCode: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Checked-In", "Checked-Out", "Expired"],
        default: "Active"
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    expiryAt: {
        type: Date,
        required: true
    },
    checkedInAt: {
        type: Date
    },
    checkedOutAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
);




module.exports = mongoose.model("Pass", passSchema);