const mongoose = require("mongoose");
const {Schema} = mongoose;

const RolesSchema= new Schema({
    role_name:({type:String,required:true,enum:["Guest","Super Admin","House Keeping"]}),
});
RolesSchema.virtual("permissions",{
    localField:"_id",
    foreignField:"role",
    ref:"permission",
    justOne:false
})
RolesSchema.set("toJSON",{virtuals:true});
RolesSchema.set("toObject",{virtuals:true});
const Roles = mongoose.model("roles",RolesSchema);
module.exports=Roles;