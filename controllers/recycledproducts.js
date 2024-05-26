const Recycledproduct=require('../models/recycledproduct');
const User=require('../models/user.js')
const {cloudinary}=require('../cloudinary')
module.exports.renderNewForm=(req,res)=>{
    res.render('recycledproducts/new');
}

module.exports.createNewRecycledProduct=async(req,res)=>{
    const authorId = req.user._id;
    const recycledproduct=new Recycledproduct({
        ...req.body.recycledproduct,
        author: authorId
    }); 
    recycledproduct.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    await recycledproduct.save();
    req.flash('success', 'Successfully posted a recycled product!');
    res.redirect('/recycledproducts/u');
}
module.exports.index = async (req, res) => {
    try {
        const { q, category } = req.query;

        const searchFilter = q ? { title: { $regex: q, $options: 'i' } } : {};
        const categoryFilter = category ? { type: category } : {};

        const filter = { ...searchFilter, ...categoryFilter };

        const recycledproducts = await Recycledproduct.find(filter);

        res.render('recycledproducts/index', { recycledproducts, searchQuery: q, selectedCategory: category });
    } catch (error) {
        console.error('Error fetching recycled products:', error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports.showMine=async(req,res)=>{
    const currentUserID = req.user._id;
    const recycledproducts=await Recycledproduct.find({ author: currentUserID });
    res.render('recycledproducts/showmine',{recycledproducts});
}
module.exports.showRecycledProduct=async(req,res)=>{
    const recycledproduct=await Recycledproduct.findById(req.params.id).populate('author');
    if(!recycledproduct){
        req.flash('error', 'Cannot find that recycled product!');
        return res.redirect('/recycledproducts');
    }
    res.render('recycledproducts/show',{recycledproduct});
}
module.exports.buyRecycledProduct=async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id;
    const user = await User.findById(userId).populate('boughtProducts');
    const existingProductIndex = user.boughtProducts.findIndex(product => product.productId.equals(productId));
    if (existingProductIndex !== -1) {
        user.boughtProducts[existingProductIndex].quantity += 1;
    }else {
        user.boughtProducts.push({ productId: productId, quantity: 1 });
    }
    await user.save();
    req.flash('success','Order Successful');
    res.redirect('/recycledproducts/buy');
}
module.exports.showOrder=async(req,res)=>{
    const productId=req.params.id;
    const userId=req.user._id;
    const user = await User.findById(userId).populate({
        path: 'boughtProducts',
        populate: { path: 'productId' } // Populate the 'productId' field of each 'boughtProduct'
    });
    const boughtProduct = user.boughtProducts.find(product => product.productId.equals(productId));
    if(!boughtProduct){
        req.flash('error', 'Cannot find the order!');
        return res.redirect('/recycledproducts/buy');
    }
    res.render('recycledproducts/showorder', {boughtProduct});
}
module.exports.showOrders = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
        path: 'boughtProducts',
        populate: { path: 'productId' } // Populate the 'productId' field of each 'boughtProduct'
    });
    res.render('recycledproducts/showorders', { boughtProducts: user.boughtProducts });
};

module.exports.renderEditForm=async(req,res)=>{
    const recycledproduct=await Recycledproduct.findById(req.params.id);
    if(!recycledproduct){
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/recycledproducts')
    }
    res.render('recycledproducts/edit',{recycledproduct});
}

module.exports.updateRecycledProduct=async(req,res)=>{
    const {id}=req.params;
    const recycledproduct=await Recycledproduct.findByIdAndUpdate(id,{...req.body.recycledproduct});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    recycledproduct.images.push(...imgs);
    await recycledproduct.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await recycledproduct.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updatted Recycled Product')
    res.redirect(`/recycledproducts/${recycledproduct._id}`);
}

module.exports.deleteRecycledProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const recycledProduct = await Recycledproduct.findById(id);
        if (!recycledProduct) {
            req.flash('error', 'Recycled Product not found');
            return res.redirect('/recycledproducts');
        }
        for (let img of recycledProduct.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
        await Recycledproduct.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted Recycled Product');
        res.redirect('/recycledproducts');
    } catch (error) {
        console.error('Error deleting recycled product:', error);
        req.flash('error', 'Failed to delete recycled product');
        res.redirect('/recycledproducts');
    }
};
module.exports.deleteOrder=async(req,res)=>{
    const productId = req.params.id;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, {
        $pull: { boughtProducts: { productId: productId } }
    });
    if (!user) {
        req.flash('error', 'Cannot find the order!');
        return res.redirect(`/recycledproducts/buy/${productId}`);
    }
    res.redirect('/recycledproducts/buy');
}
