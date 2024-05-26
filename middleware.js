const { wasteProductSchema,recycledProductSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const WasteProduct = require('./models/wasteproduct');
const RecycledProduct = require('./models/recycledproduct');
const Admin=require('./models/admin.js')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in');
        return res.redirect('/user/login');
    }
    next();
}
module.exports.isUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash('error', 'You must be logged in');
      return res.redirect('/user/login');
    }
  
    if (req.user.constructor.modelName !== 'User') {  // Check if the authenticated user is a 'User'
      req.flash('error', 'Unauthorized access');  // Optional: customize the error message
      return res.redirect('/');  // Redirect to home page or other appropriate page
    }
  
    next();  // If all checks pass, continue to the next middleware or route handler
  };
module.exports.isTrader = (req, res, next) => {
    if (!req.isAuthenticated()) {  // Check if the user is authenticated
      req.session.returnTo = req.originalUrl;  // Store the return URL for redirection after login
      req.flash('error', 'You must be logged in');  // Inform the user they need to log in
      return res.redirect('/trader/login');  // Redirect to trader login
    }
  
    if (req.user.constructor.modelName !== 'Trader') {  // Ensure the authenticated user is a Trader
      req.flash('error', 'Unauthorized access');  // Message to show if user is not a Trader
      return res.redirect('/');  // Redirect to a default page or unauthorized page
    }
  
    next();  // If authenticated and the correct type, continue to the next middleware or handler
  };  
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateWasteProduct = (req, res, next) => {
    const { error } = wasteProductSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.validateRecycledProduct = (req, res, next) => {
    const { error } = recycledProductSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports.isWasteProductAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const wasteproduct=await WasteProduct.findById(id);
    if(!wasteproduct.author.equals(req.user._id)){
        req.flash('error','You dont have the permission to do that');
        return res.redirect(`/wasteproducts/${id}`)
    }
    next();
}
module.exports.isRecycledProductAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const recycledproduct=await RecycledProduct.findById(id);
    if(!recycledproduct.author.equals(req.user._id)){
        req.flash('error','You dont have the permission to do that');
        return res.redirect(`/recycledproducts/${id}`)
    }
    next();
}
module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.constructor.modelName === 'Admin') {
        return next();
    }
    req.flash('error', 'You must be logged in as an admin to view this page.');
    res.redirect('/admin/login');
};