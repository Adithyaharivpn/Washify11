var express = require('express');
var router = express.Router();
const Center = require('../model/center');

router.post('/add-center', async (req, res) => {
    try {
        const { oname, lname, hname, gname, sname, aname, iname, available } = req.body;

        const newCenter = new Center({
            oname,
            lname,
            hname,
            gname,
            sname,
            aname,
            iname,
            available
        });

        const savedCenter = await newCenter.save();
        res.status(201).json({ message: 'Center added successfully!', data: savedCenter });
    } catch (error) {
        console.error('Error adding center:', error);
        res.status(500).json({ message: 'Failed to add center', error: error.message });
    }
});

// GET: Fetch all Centers (Optional, useful for displaying them later)
router.get('/centers', async (req, res) => {
    try {
        const centers = await Center.find();
        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching centers' });
    }
});

module.exports=router;