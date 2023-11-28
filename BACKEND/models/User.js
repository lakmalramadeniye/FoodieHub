const mongoose = require('mongoose');
//use for encrypt password
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum : ['user' , 'admin', 'staff'],
        required:true
    }
});

//check password is dcrypted before save password
userSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
        return next(err);
        this.password = passwordHash;
        next();
    });

});



userSchema.pre('updateOne',function(next){
    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password,10,(err,passwordHash)=>{
        if(err)
        return next(err);
        this.password = passwordHash;
        next();
    });

});

userSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err)
            return cb(err);
            
        else{
            if(!isMatch)
                return cb(null,isMatch);
            
            return cb(null,this);

        }

    });
}


const User = mongoose.model("User",userSchema);




//important to export
module.exports = User;