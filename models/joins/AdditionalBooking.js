const mongoose = require("mongoose");
const {Schema} = mongoose;

const AdditionalBookingSchema= new Schema({
    service:({type:Schema.Types.ObjectId,ref:"additionalservice"}),
    booking:({type:Schema.Types.ObjectId,ref:"booking"})
})
AdditionalBookingSchema.index({service:1,booking:1},{unique:true})
const AdditionalBooking = mongoose.model("room_facility",AdditionalBookingSchema);
module.exports=AdditionalBooking;