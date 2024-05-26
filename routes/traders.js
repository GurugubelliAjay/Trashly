const express=require('express');
const router=express.Router();
const passport=require('passport')
const catchAsync=require('../utils/catchAsync')
const Trader=require('../models/trader');
const WasteProduct=require('../models/wasteproduct');

const {isTrader}=require('../middleware')
router.get('/register',(req,res)=>{
    res.render('traders/register')
})
router.post('/register',catchAsync(async(req,res)=>{
    try{
        const {email,username,password,location,phone,recyclingType}=req.body;
        const trader=new Trader({email,username,location,phone,recyclingType});
        const registeredTrader=await Trader.register(trader,password);
        req.login(registeredTrader,err=>{
            if(err) return next(err);
            req.flash('success','Welcome to Trashly');
            res.redirect('/wasteproducts')
        }) 
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/trader/register')
    }
}))

router.get('/login',(req,res)=>{
    res.render('traders/login')
})
router.post('/login',passport.authenticate('trader-local',{failureFlash:true,failureRedirect:'/trader/login'}),(req,res)=>{
    req.flash('success','Welcome back');
    res.redirect('/recycledproducts');
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out !!');
        res.redirect('/');
    });
}); 
router.get('/dashboard', isTrader, async (req, res) => {
    try {
        const traderId = req.user._id; // Assuming req.user contains the logged-in trader's info
        const wasteProducts = await WasteProduct.find({ trader: traderId });
        res.render('traders/dashboard', { wasteProducts });
    } catch (error) {
        console.error('Error fetching waste products for trader:', error);
        req.flash('error', 'Failed to load the dashboard');
        res.redirect('/');
    }
});
router.get('/profile', isTrader, async (req, res) => {
    try {
        const trader = await Trader.findById(req.user._id);
        res.render('traders/profile', { trader });
    } catch (err) {
        req.flash('error', 'Cannot find user profile');
        res.redirect('/');
    }
});
module.exports=router;