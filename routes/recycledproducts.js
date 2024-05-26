const express=require('express');
const catchAsync = require('../utils/catchAsync');
const router=express.Router();
const recycledproducts=require('../controllers/recycledproducts');
const Recycledproduct=require('../models/recycledproduct');
const User=require('../models/user.js')
const {isLoggedIn,validateWasteProduct,validateRecycledProduct,isRecycledProductAuthor,isTrader, isUser}=require('../middleware.js')
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});

router.route('/')
    .get(catchAsync(recycledproducts.index))
    .post(isTrader,upload.array('image'),validateRecycledProduct,catchAsync(recycledproducts.createNewRecycledProduct))

router.get('/new',isTrader,(recycledproducts.renderNewForm));
router.get('/search', catchAsync(recycledproducts.searchProduct));
router.get('/filter',catchAsync(recycledproducts.filterProduct))
router.get('/u',isTrader,(recycledproducts.showMine));

router.route('/:id')
    .get(isLoggedIn,catchAsync(recycledproducts.showRecycledProduct))
    .put(isTrader,isRecycledProductAuthor,upload.array('image'),validateRecycledProduct,catchAsync(recycledproducts.updateRecycledProduct))
    .delete(isTrader,isRecycledProductAuthor,catchAsync(recycledproducts.deleteRecycledProduct))

router.get('/:id/edit',isTrader,isRecycledProductAuthor,(recycledproducts.renderEditForm));
module.exports=router;