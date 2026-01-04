const express = require('express');
const router = express.Router();
const bookingModel = require('../model/booking');

// GET ALL BOOKINGS (For Admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await bookingModel.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
});

// CREATE BOOKING (For User)
router.post('/', async (req, res) => {
    try {
        const newBooking = new bookingModel(req.body);
        await newBooking.save();
        res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error creating booking" });
    }
});

// UPDATE STATUS (For Admin)
router.put('/:id', async (req, res) => {
    try {
        await bookingModel.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.status(200).json({ message: "Status updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating" });
    }
});

module.exports = router;