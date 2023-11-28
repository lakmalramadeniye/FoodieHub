const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
    
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
    nic:{
        type:String,
        required: true
    },
    designation:{
        type:String,
        required: true
    },
    age:{
        type:Number,
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
        type: String
    }
});

const Staff = mongoose.model("Staff",staffSchema);




//important to export
module.exports = Staff;