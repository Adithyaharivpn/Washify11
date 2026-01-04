const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'center' },
    centerName: { type: String }, // Store name for easier display
    service: { type: String },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' } // Pending, Completed, Cancelled
});

const bookingModel = mongoose.model('booking', bookingSchema);
module.exports = bookingModel;
                       