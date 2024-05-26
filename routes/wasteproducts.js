const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const wasteproducts=require('../controllers/wasteproducts');
const WasteProduct=require('../models/wasteproduct');
const {isLoggedIn,validateWasteProduct,validateRecycledProduct,isWasteProductAuthor,isUser,isTrader}=require('../middleware.js')
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});

router.route('/')
    .get(isLoggedIn,catchAsync(wasteproducts.index))
    .post(isLoggedIn,upload.array('image'),validateWasteProduct,catchAsync(wasteproducts.createNewWasteProduct));
    

router.get('/new',wasteproducts.renderNewForm);

router.route('/:id')
    .get(isLoggedIn,catchAsync(wasteproducts.showWasteProduct))
    .put(isLoggedIn,isWasteProductAuthor,upload.array('image'),validateWasteProduct,catchAsync(wasteproducts.updateWasteProduct))
    .delete(isLoggedIn,isWasteProductAuthor,catchAsync(wasteproducts.deleteWasteProduct))

    
router.get('/:id/edit',isLoggedIn,isWasteProductAuthor,(wasteproducts.renderEditForm));

router.post('/:id/accept',isTrader,catchAsync(wasteproducts.acceptWasteProduct));

router.post('/:id/reject',isTrader,catchAsync(wasteproducts.rejectWasteProduct));

module.exports=router;


