const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Complaint = require('../models/complaint');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Show form to create a new complaint
router.get('/new', (req, res) => {
    res.render('complaints/new');
});

// Handle new complaint submission
router.post('/', isLoggedIn, upload.array('image'), catchAsync(async (req, res) => {
    const { description, location } = req.body;
    const complaint = new Complaint({
        description,
        location,
        user: req.user._id
    });
    complaint.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await complaint.save();
    req.flash('success', 'Complaint submitted successfully');
    res.redirect('/complaints');
}));

// Show list of complaints
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const complaints = await Complaint.find({ user: req.user._id }).populate('user');
    res.render('complaints/index', { complaints });
}));

module.exports = router;
