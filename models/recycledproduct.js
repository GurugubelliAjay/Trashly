const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const RecycledproductSchema=new Schema({
    title:String,
    images:[ImageSchema],
    type:String,
    price:Number,
    description:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'Trader'
    }
})

module.exports=mongoose.model('Recycledproduct',RecycledproductSchema);