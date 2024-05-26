const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    recycledProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recycledproduct',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 
    },
    pickUpDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Delivered'],
        default: 'Pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
