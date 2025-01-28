const mongoose = require("mongoose");
const {Schema} = mongoose;

const PermissionListSchema= new Schema({
    Permission_name:({type:String,required:true,enum:[""]}),
})
const permission_list = mongoose.model("permission_list",PermissionListSchema);
module.exports=permission_list;