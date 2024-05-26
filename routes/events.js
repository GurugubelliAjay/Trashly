const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Event = require('../models/event');
const { isAdmin,isLoggedIn } = require('../middleware');

// Admin route to create an event
router.get('/new', isAdmin, (req, res) => {
    res.render('events/new');
});

router.post('/new', isAdmin, catchAsync(async (req, res) => {
    const { name, description, date, time, location } = req.body;
    const event = new Event({ name, description, date, time, location });
    await event.save();
    req.flash('success', 'Event created successfully');
    res.redirect('/events');
}));

// Route to view all events
router.get('/', catchAsync(async (req, res) => {
    const events = await Event.find({});
    res.render('events/index', { events });
}));

// Route to view a single event
router.get('/:id', catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('registeredUsers');
    res.render('events/show', { event });
}));
// User route to register for an event
router.post('/:id/register', isLoggedIn, catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event.registeredUsers.includes(req.user._id)) {
        event.registeredUsers.push(req.user._id);
        await event.save();
        req.flash('success', 'Successfully registered for the event');
    } else {
        req.flash('error', 'You are already registered for this event');
    }
    res.redirect(`/events/${event._id}`);
}));

module.exports = router;
