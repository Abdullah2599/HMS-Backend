const mongoose = require("mongoose");
const {Schema} = mongoose;

const MaintenanceSchema= new Schema({
    type:({type:String,required:true,unique:true }),
})
const Maintenance = mongoose.model("maintenance",MaintenanceSchema);
module.exports=Maintenance;