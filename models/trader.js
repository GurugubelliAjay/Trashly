const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const TraderSchema=new Schema({
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
    recyclingType:{
        type:String,
        required:true
    }
});

TraderSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Trader',TraderSchema);