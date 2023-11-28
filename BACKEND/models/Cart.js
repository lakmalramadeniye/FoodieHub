const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    
    productID:{
        type:String,
        required: true
    },
    productName:{
        type:String,
        required: true
    },
    productDescription:{
        type:String,
        required: true
    },
    productCode:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    selectedQuantity:{
        type:String,
        required: true
    },
    nutritionalInformation:{
        type:String,
        required: true
    },
    portionSize:{
        type:String,
        required: true
    },
    productImage:{
        type:String
    },
    createdDate:{
        type:String,
        required: true
    },
    customerID:{
        type:String
    },
    customerImage:{
        type:String
    },
    userID:{
        type:String,
        required: true
    },
    fname:{
        type:String,
        required: true
    },
    lname:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    mobile:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    cartStatus:{
        type: String,
        required: true
    }
});

const Cart = mongoose.model("Cart",cartSchema);




//important to export
module.exports = Cart;