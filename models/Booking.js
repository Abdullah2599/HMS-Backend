const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookingSchema= new Schema({
    booking_code:({type:String,required:true,unique:true}),
    room:({type:Schema.Types.ObjectId,ref:"room"}),
    guest:({type:Schema.Types.ObjectId,ref:"user"}),
    valid_from:({type:Date,require:true}),
    valid_to:({type:Date,require:true}),
    paymentstatus: { 
        type: String, 
        default: "pending", 
        enum: ["pending", "paid"] // Restrict values to "pending" or "paid"
    },
    totalBill:({type:Number,require:true})
   
})
BookingSchema.virtual("service",{
    localField:"_id",
    foreignField:"booking",
    ref:"additional_booking",
    justOne:false
});
BookingSchema.set("toJSON",{virtuals:true})
BookingSchema.set("toObject",{virtuals:true})
const booking = mongoose.model("booking",BookingSchema);
module.exports=booking;