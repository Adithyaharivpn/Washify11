const express = require('express');
const router = express.Router();
const centerModel = require('../model/center');

// GET ALL CENTERS
router.get('/', async (req, res) => {
    try {
        const centers = await centerModel.find();
        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching centers" });
    }
});

// ADD CENTER
router.post('/', async (req, res) => {
    try {
        const newCenter = new centerModel(req.body);
        await newCenter.save();
        res.status(200).json({ message: "Center added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding center" });
    }
});

// UPDATE CENTER (Put this in your file)
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        
        const center = await centerModel.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!center) {
            return res.status(404).json({ message: "Center not found" });
        }
        
        res.status(200).json({ message: "Center updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating center" });
    }
});

// DELETE CENTER
router.delete('/:id', async (req, res) => {
    try {
        await centerModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Center deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting" });
    }
});

module.exports = router;