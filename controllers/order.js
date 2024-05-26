const Recycledproduct=require('../models/recycledproduct');
const User=require('../models/user.js')
const Order=require('../models/order.js')

module.exports.renderNewForm=async (req, res) => {
        const productId = req.query.productId;
        const recycledProduct = await Recycledproduct.findById(productId);
        res.render('orders/new', {recycledProduct});
};
module.exports.createNewOrder = async (req, res) => {
    try {
        const { recycledProduct, quantity, pickUpDate, location } = req.body;
        const userId = req.user._id;

        const product = await Recycledproduct.findById(recycledProduct);

        const totalPrice = product.price * parseInt(quantity);

        const user = await User.findById(userId);

        if (user.redeemPoints >= totalPrice) {
            user.redeemPoints -= totalPrice;

            await user.save();

            const order = new Order({
                recycledProduct,
                quantity,
                pickUpDate,
                location,
                user: userId,
                status: 'Pending' // Set the status to 'Pending'
            });

            await order.save();

            req.flash('success', 'Order placed successfully');
            res.redirect('/orders');
        } else {
            req.flash('error', 'Insufficient redeem points to place the order');
            res.redirect('/orders');
        }
    } catch (error) {
        console.error('Error creating new order:', error);
        req.flash('error', 'Failed to create new order');
        res.redirect('/orders');
    }
};


    
module.exports.showOrders=async (req, res) => {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate('recycledProduct');
        res.render('orders/index', { orders });
}
module.exports.AllOrders = async (req, res) => {
    try {
        const currentUserID = req.user._id;
        const recycledProducts = await Recycledproduct.find({ author: currentUserID });

        const recycledProductIds = recycledProducts.map(product => product._id);

        const orders = await Order.find({ recycledProduct: { $in: recycledProductIds } }).populate('recycledProduct');

        res.render('orders/index', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        req.flash('error', 'Error fetching orders');
        res.redirect('/');
    }
};

module.exports.showOrder= async (req, res) => {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('recycledProduct');
        if (!order) {
                req.flash('error', 'Order not found');
                return res.redirect('/orders');
        }
        res.render('orders/show', { order });
}
module.exports.deleteOrder = async (req, res) => {
        try {
            const orderId = req.params.id;
    
            // Find the order that is being deleted
            const order = await Order.findById(orderId);
    
            // Calculate the total price of the order based on the recycled product's price and quantity
            const product = await Recycledproduct.findById(order.recycledProduct);
            const totalPrice = product.price * order.quantity;
    
            // Find the user associated with the order
            const user = await User.findById(order.user);
    
            // Refund the redeem points by adding the total price back to the user's redeem points
            user.redeemPoints += totalPrice;
    
            // Save the updated user
            await user.save();
    
            await Order.findByIdAndDelete(orderId);
    
            req.flash('success', 'Order cancelled successfully. Redeem points refunded.');
            res.redirect('/orders');
        } catch (error) {
            console.error('Error deleting order:', error);
            req.flash('error', 'Failed to cancel order');
            res.redirect('/orders');
        }
    };
    
module.exports.editOrder=async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send('Order not found');
        }
        order.status = status;
        await order.save(); // Save the updated order
        req.flash('success', 'Order status updated successfully');
        res.redirect('/orders'); // Redirect to the orders page or another appropriate page
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error updating order status:', error);
        req.flash('error', 'Failed to update order status');
        res.redirect('/orders');
    }
};