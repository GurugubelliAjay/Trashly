const { required } = require('joi');
const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    redeemPoints: {
        type: Number,
        default: 0 
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);