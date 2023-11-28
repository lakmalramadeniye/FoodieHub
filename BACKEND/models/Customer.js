const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    
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
    image:{
        type:String
    },
});

const Customer = mongoose.model("Customer",customerSchema);




//important to export
module.exports = Customer;