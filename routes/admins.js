const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/admin');
const User = require('../models/user');
const Trader = require('../models/trader');
const Order = require('../models/order');
const WasteProduct = require('../models/wasteproduct');
const RecycledProduct = require('../models/recycledproduct');
const Complaint = require('../models/complaint');
const Event=require('../models/event');

const passport = require('passport');
const { storeReturnTo, isLoggedIn, isAdmin } = require('../middleware');

// Admin registration form
router.get('/register', (req, res) => {
    res.render('admins/register');
});

// Handle admin registration
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const admin = new Admin({ email, username });
        const registeredAdmin = await Admin.register(admin, password);
        req.login(registeredAdmin, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Trashly Admin Panel');
            res.redirect('/admin/dashboard');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/admin/register');
    }
}));

// Admin login form
router.get('/login', (req, res) => {
    res.render('admins/login');
});

// Handle admin login
router.post('/login', storeReturnTo, passport.authenticate('admin-local', { failureFlash: true, failureRedirect: '/admin/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = res.locals.returnTo || '/admin/dashboard';
    res.redirect(redirectUrl);
});

// Admin logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out !!');
        res.redirect('/');
    });
});


// Admin dashboard
router.get('/dashboard',isLoggedIn, isAdmin, async(req, res) => {
    try {
        const users = await User.find({});
        const traders = await Trader.find({});
        const orders = await Order.find({});
        const wasteProducts = await WasteProduct.find({}).populate('trader author');
        const recycledProducts = await RecycledProduct.find({}).populate('author');
        const complaints = await Complaint.find({}).populate('user');
        const events=await Event.find({}).populate('registeredUsers');
        res.render('admins/dashboard', { users, traders, orders, wasteProducts, recycledProducts, complaints,events });
    } catch (err) {
        req.flash('error', 'Error loading dashboard data');
        res.redirect('/');
    }
});

module.exports = router;
