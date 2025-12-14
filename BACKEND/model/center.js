const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
    oname: { type: String, required: true },     // Owner Name
    lname: { type: String, required: true },     // Laundry Center Name
    hname: { type: String, required: true },     // House/Address
    gname: { type: String, required: false },    // Gram Panchayat
    sname: { type: String, required: false },    // Street Name
    aname: { type: String, required: true },     // Opens At (time)
    iname: { type: String, required: true },     // Closes At (time)
    phone: { type: String, required: false },    
    services: { type: [String], default: [] },   
    description: { type: String },           
    rating: { type: Number, default: 0 },     
    available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Center', centerSchema);