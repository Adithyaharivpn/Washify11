const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
    // Mapping to your exact frontend input names
    oname: { type: String, required: true }, // Center Name
    lname: { type: String, required: false }, // Center Address
    hname: { type: String, required: true }, // Operating Hours
    gname: { type: String, required: false }, // Services Provide
    sname: { type: String, required: false }, // Description
    aname: { type: String, required: true }, // Opens At
    iname: { type: String, required: true }, // Closes At
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Center', centerSchema);