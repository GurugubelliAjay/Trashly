const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const Event = require('../models/event');
const { isAdmin,isLoggedIn } = require('../middleware');

router.get('/',async(req,res)=>{
    const events = await Event.find({});
    res.render('home/index',{events})
})

router.get('/about',(req,res)=>{
    res.render('home/about');
})
router.get('/blogs',(req,res)=>{
    res.render('home/blogs');
})
router.get('/blogs/blog1',(req,res)=>{
    res.render('home/blogs/blog1');
})
router.get('/blogs/blog2',(req,res)=>{
    res.render('home/blogs/blog2');
})
router.get('/blogs/blog3',(req,res)=>{
    res.render('home/blogs/blog3');
})
router.get('/blogs/blog4',(req,res)=>{
    res.render('home/blogs/blog4');
})
router.get('/redeem',(req,res)=>{
    res.render('home/redeem')
})

module.exports=router;