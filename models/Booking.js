const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookingSchema= new Schema({
    booking_code:({type:String,required:true,unique:true}),
    room:({type:Schema.Types.ObjectId,ref:"room"}),
    valid_from:({type:Date,require:true}),
    valid_to:({type:Date,require:true})
   
})
const booking = mongoose.model("booking",BookingSchema);
module.exports=booking;