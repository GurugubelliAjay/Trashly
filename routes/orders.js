const express=require('express');
const catchAsync = require('../utils/catchAsync.js');
const router=express.Router();
const recycledproducts=require('../controllers/recycledproducts.js');
const orders=require('../controllers/order.js')
const Recycledproduct=require('../models/recycledproduct.js');
const User=require('../models/user.js')
const {isLoggedIn,validateWasteProduct,validateRecycledProduct,isRecycledProductAuthor,isTrader, isUser}=require('../middleware.js');

router.get('/new',catchAsync(orders.renderNewForm));
router.get('/all',isTrader,catchAsync(orders.AllOrders));

router.route('/')
    .get(isLoggedIn,catchAsync(orders.showOrders))
    .post(isLoggedIn,catchAsync(orders.createNewOrder))

router.route('/:id')
    .get(isLoggedIn,catchAsync(orders.showOrder))
    .put(isLoggedIn,catchAsync(orders.editOrder))
    .delete(isLoggedIn,catchAsync(orders.deleteOrder))
module.exports=router;