const mongoose = require("mongoose");
const {Schema} = mongoose;

const PermissionSchema= new Schema({
    room_type:({type:String,unique:true,required:true}),
    avaibility:({type:String,enum:["available","disabled","in_work"]}),
    size:({type:Number})
    
})
PermissionSchema.index({role:1,permission_list:1},{unique:true})
const Permission = mongoose.model("permission",PermissionSchema);
module.exports=Permission;