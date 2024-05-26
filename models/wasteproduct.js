const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const WasteproductSchema=new Schema({
    title:String,
    images:[ImageSchema],
    type:String,
    quantity:Number,
    description:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    trader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trader',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'accepted', 'rejected'],
        default: 'pending'
    }
})

module.exports=mongoose.model('Wasteproduct',WasteproductSchema);
