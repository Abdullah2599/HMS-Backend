const mongoose = require("mongoose");
const {Schema} = mongoose;

const RoomFacilitySchema= new Schema({
    facility:({type:Schema.Types.ObjectId,ref:"facility"}),
    room:({type:Schema.Types.ObjectId,ref:"room"})
})
RoomFacilitySchema.index({facility:1,room:1},{unique:true})
const RoomFacility = mongoose.model("room_facility",RoomFacilitySchema);
module.exports=RoomFacility;