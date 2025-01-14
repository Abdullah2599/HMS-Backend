const mongoose = require("mongoose");
const {Schema} = mongoose;

const PermissionSchema= new Schema({
    role:({type:Schema.Types.ObjectId,ref:"roles"}),
    permission_list:({type:Schema.Types.ObjectId,ref:"permission_list"})
})
PermissionSchema.index({role:1,permission_list:1},{unique:true})
const Permission = mongoose.model("permission",PermissionSchema);
module.exports=Permission;