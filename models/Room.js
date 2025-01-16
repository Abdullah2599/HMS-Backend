const mongoose = require("mongoose");
const {Schema} = mongoose;

const RoomSchema= new Schema({
    roomCode:({type:String,required:true,unique:true}),
    roomTitle:({type:String,required:true}),
    description:({type:String}),
    roomType:({type:String,required:true,enum:["available","disabled","in_work"]}),
    avaibility:({type:String,enum:["available","disabled","occupied","in_work"],default:"available"}),
    size:({type:Number}),
    person:({type:Number,required:true}),
    price:({type:Number, required:true}),
    image:({type:String}),
    imagelg:({type:String})

});

RoomSchema.virtual("roombookings",{
    localField:"_id",
    foreignField:"room",
    ref:"booking",
    justOne:false
});

RoomSchema.set("toJSON",{virtuals:true})
RoomSchema.set("toObject",{virtuals:true})

const Room = mongoose.model("room",RoomSchema);
module.exports=Room;