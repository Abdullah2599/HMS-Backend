const mongoose = require("mongoose");
const {Schema} = mongoose;

const RoomSchema= new Schema({
    room_code:({type:String,required:true,unique:true}),
    room_name:({type:String,required:true,enum:["available","disabled","in_work"]}),
    description:({type:String}),
    room_type:({type:String,required:true,enum:["available","disabled","in_work"]}),
    avaibility:({type:String,enum:["available","disabled","in_work"]}),
    size:({type:Number}),
    person:({type:Number,required:true}),
    price:({type:Number, required:true}),
    image:({type:String}),
    imagelg:({type:String})

});

RoomSchema.virtual("rommbookings",{
    localField:"_id",
    foreignField:"room",
    ref:"booking",
    justOne:false
});

RoomSchema.set("toJSON",{virtuals:true})
RoomSchema.set("toObject",{virtuals:true})

const Room = mongoose.model("room",RoomSchema);
module.exports=Room;