const mongoose = require('mongoose');
const Cart = require('./Cart');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderStatus: {
        type: String,
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    },
    orderDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart' // Reference to the 'Cart' model
    }],
    orderPlacedDate: {
        type: String,
        required: true
    },
    userID:{
        type:String,
        required: true
    },
});

const Order = mongoose.model("Order",orderSchema);




//important to export
module.exports = Order;