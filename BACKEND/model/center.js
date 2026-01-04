const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true }, // e.g., "Thrissur"
    services: { type: String }, // e.g., "Dry Clean, Wash"
    description: { type: String },
    contact: { type: String },  // Phone number
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 }
});

const centerModel = mongoose.model('center', centerSchema);
module.exports = centerModel;