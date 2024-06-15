require('dotenv').config();
const WasteProduct=require('../models/wasteproduct');
const User=require('../models/user')
const Trader=require('../models/trader');
const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const {cloudinary}=require('../cloudinary')
const geolib = require('geolib');
const matchTrader = async (wasteProduct, userLocation) => {
    try {
        const traders = await Trader.find({
            recyclingType: wasteProduct.type,
        });

        if (!traders || traders.length === 0) {
            console.error('No traders found for the specified recycling type:', wasteProduct.type);
            return null;
        }

        const traderDistances = traders.map(trader => {
            if (!trader.location || !trader.location.coordinates) { 
                console.error('Invalid trader location:', trader);
                return null;
            }

            const distance = geolib.getDistance(
                { latitude: userLocation.coordinates[1], longitude: userLocation.coordinates[0] },
                { latitude: trader.location.coordinates[1], longitude: trader.location.coordinates[0] }
            );

            return { trader, distance };
        });

        traderDistances.sort((a, b) => a.distance - b.distance);

        const nearestTrader = traderDistances[0];

        if (!nearestTrader) {
            console.error('No nearest trader found.');
            return null;
        }

        return nearestTrader.trader;
    } catch (error) {
        console.error('Error matching trader:', error);
        return null;
    }
};


const notifyTrader = async (trader, wasteProduct) => {
    const phone='+91'+trader.phone;
    try {
        await client.messages.create({
            body: `New waste product "${wasteProduct.title}" has been assigned to you. Please login to your account for details.`,
            from: '+12073897519', // Your Twilio phone number
            to: phone // Trader's phone number
        });
        console.log(`SMS notification sent to trader ${trader.username} about new waste product ${wasteProduct.title}`);
    } catch (error) {
        console.error('Error sending SMS notification:', error);
    }
};

module.exports.renderNewForm=(req,res)=>{
    res.render('wasteproducts/new');
}
module.exports.createNewWasteProduct = async (req, res) => {
    const wasteproductData = req.body.wasteproduct;
    wasteproductData.author = req.user._id;
    const wasteproduct = new WasteProduct(wasteproductData);
    wasteproduct.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    try {
        await wasteproduct.save();

        // Retrieve user's location from the User model
        const user = await User.findById(req.user._id);

        // Find the nearest trader based on the waste product and user's location
        const matchedTrader = await matchTrader(wasteproduct, user.location);

        if (matchedTrader) {
            wasteproduct.trader = matchedTrader._id;
            wasteproduct.status = 'assigned';
            await wasteproduct.save();

            // Notify the trader
            await notifyTrader(matchedTrader, wasteproduct);
        } else {
            wasteproduct.status = 'rejected';
            await wasteproduct.save();
        }

        req.flash('success', 'Successfully posted waste product');
        res.redirect('/wasteproducts');
    } catch (error) {
        console.error('Error creating waste product:', error);
        req.flash('error', 'Failed to create waste product');
        res.redirect('/wasteproducts/new');
    }
};



module.exports.index = async (req, res) => {
    const currentUserID = req.user._id;
    const wasteproducts = await WasteProduct.find({ author: currentUserID });
    res.render('wasteproducts/index', { wasteproducts });
}

module.exports.showWasteProduct = async (req, res) => {
    try {
        const wasteproduct = await WasteProduct.findById(req.params.id)
            .populate('author')
            .populate('trader');
        
        if (!wasteproduct) {
            req.flash('error', 'Cannot find that waste product');
            return res.redirect('/wasteproducts');
        }

        res.render('wasteproducts/show', { wasteproduct });
    } catch (error) {
        console.error('Error fetching waste product:', error);
        req.flash('error', 'Something went wrong');
        res.redirect('/wasteproducts');
    }
};

module.exports.updateWasteProduct = async (req, res) => {
    const { id } = req.params;

    const originalWasteProduct = await WasteProduct.findById(id);

    const wasteproduct = await WasteProduct.findByIdAndUpdate(id, { ...req.body.wasteproduct }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    wasteproduct.images.push(...imgs);
    await wasteproduct.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await wasteproduct.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    const wastePoints = {
        "Organic Waste": 10,
        "Paper Waste": 20,
        "Plastic Waste": 30,
        "Glass Waste": 40,
        "Metal Waste": 50,
        "E Waste": 60,
        "Hazardous Waste": 70,
        "Textile Waste": 80,
        "Food Waste": 90,
        "Medical Waste": 100
    };

    const userId = wasteproduct.author;
    const user = await User.findById(userId);

    if (user) {
        const originalPoints = wastePoints[originalWasteProduct.type] * originalWasteProduct.quantity;
        const updatedPoints = wastePoints[wasteproduct.type] * wasteproduct.quantity;
        const pointsDifference = updatedPoints - originalPoints;

        user.redeemPoints += pointsDifference;
        await user.save();
    }

    req.flash('success', 'Successfully updated Waste Product and updated your redeem points');
    res.redirect(`/wasteproducts/${wasteproduct._id}`);
}

module.exports.renderEditForm=async(req,res)=>{
    const wasteproduct=await WasteProduct.findById(req.params.id);
    if(!wasteproduct){
        req.flash('error', 'Cannot find that product')
        return res.redirect('/wasteproducts')
    }
    res.render('wasteproducts/edit',{wasteproduct});
}

module.exports.deleteWasteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await WasteProduct.findById(id);

        if (!deletedProduct) {
            req.flash('error', 'Waste Product not found');
            return res.redirect('/wasteproducts');
        }

        for (let img of deletedProduct.images) {
            await cloudinary.uploader.destroy(img.filename);
        }

        await WasteProduct.findByIdAndDelete(id);

        req.flash('success', 'Successfully deleted Waste Product');
        res.redirect('/wasteproducts');
    } catch (error) {
        console.error('Error deleting waste product:', error);
        req.flash('error', 'Failed to delete waste product');
        res.redirect('/wasteproducts');
    }
};

// Route for a trader to accept the waste assignment
module.exports.acceptWasteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const wasteProduct = await WasteProduct.findById(id).populate('author');

        if (wasteProduct.trader.toString() === req.user._id.toString() && wasteProduct.status === 'assigned') {
            wasteProduct.status = 'accepted';

            // Define points for different categories (example values)
            const wastePoints = {
                "Organic Waste": 10,
                "Paper Waste": 20,
                "Plastic Waste": 30,
                "Glass Waste": 40,
                "Metal Waste": 50,
                "E Waste": 60,
                "Hazardous Waste": 70,
                "Textile Waste": 80,
                "Food Waste": 90,
                "Medical Waste": 100
            };

            let redeemPoints = 0;

            // Calculate redeem points based on category and quantity
            const wasteType = wasteProduct.type;
            const wasteQuantity = wasteProduct.quantity;
            if (wastePoints[wasteType]) {
                redeemPoints = wastePoints[wasteType] * wasteQuantity;
            } else {
                // Default points if category not found
                redeemPoints = 10 * wasteQuantity;
            }

            // Update author's redeem points
            const author = wasteProduct.author;
            author.redeemPoints += redeemPoints;

            await author.save();
            await wasteProduct.save();

            req.flash('success', `You have accepted the waste assignment and ${redeemPoints} redeem points have been added to the user`);
            res.redirect('/trader/dashboard');
        } else {
            req.flash('error', 'You are not authorized to accept this assignment');
            res.redirect('/trader/dashboard');
        }
    } catch (error) {
        console.error('Error accepting waste product:', error);
        req.flash('error', 'Failed to accept the waste assignment');
        res.redirect('/trader/dashboard');
    }
};


// Route for a trader to reject the waste assignment
module.exports.rejectWasteProduct=async (req, res) => {
    const { id } = req.params;
    const wasteProduct = await WasteProduct.findById(id);

    if (wasteProduct.trader.toString() === req.user._id.toString() && wasteProduct.status === 'assigned') {
        wasteProduct.status = 'rejected';
        wasteProduct.trader = null;
        await wasteProduct.save();
        req.flash('success', 'You have rejected the waste assignment');
        res.redirect('/trader/dashboard');
    } else {
        req.flash('error', 'You are not authorized to reject this assignment');
        res.redirect('/trader/dashboard');
    }
};
