const mongoose = require("mongoose");
const {Schema} = mongoose;

const PermissionSchema= new Schema({
    room_type:({type:String,unique:true,required:true}),
    
})
PermissionSchema.index({role:1,permission_list:1},{unique:true})
const Permission = mongoose.model("permission",PermissionSchema);
module.exports=Permission;