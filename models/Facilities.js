const mongoose = require("mongoose");
const {Schema} = mongoose;

const FacilitySchema= new Schema({
    name:({type:String,required:true,unique:true}),
    icon:({type:String,required:true}),
})
const Facility = mongoose.model("facility",FacilitySchema);
module.exports=Facility;