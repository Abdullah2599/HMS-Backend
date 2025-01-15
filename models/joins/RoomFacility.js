const mongoose = require("mongoose");
const {Schema} = mongoose;

const RoomFacilitySchema= new Schema({
    facility:({type:Schema.Types.ObjectId,ref:"facility"}),
    room:({type:Schema.Types.ObjectId,ref:"room"})
})
RoomFacilitySchema.index({role:1,RoomFacility_list:1},{unique:true})
const RoomFacility = mongoose.model("room_facility",RoomFacilitySchema);
module.exports=RoomFacility;