const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    
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
    quantity:{
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
    image:{
        type:String
    },
    createdBy:{
        type:String,
        required: true
    },
});

const Product = mongoose.model("Product",productSchema);




//important to export
module.exports = Product;