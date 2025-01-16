const mongoose = require("mongoose");
const {Schema} = mongoose;

const AdditionalServiceSchema= new Schema({
    name:({type:String,required:true,unique:true}),
    price:({type:Number,required:true}),
})
const AdditionalService = mongoose.model("additionalservice",AdditionalServiceSchema);
module.exports=AdditionalService;