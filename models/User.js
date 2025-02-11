const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema= new Schema({
    username:({type:String,required:true}),
    email:({type:String,required:true,unique:true}),
    password:({type:String,required:true }),
    contact:({type:String,required:true}),
    CNIC:({type:String}),
    address:({type:String}),
    status:({type:String,enum:["Active","InActive"],default:"Active"}),
    role:({type:Schema.Types.ObjectId,ref:"roles"})
    
})

const user = mongoose.model("user",UserSchema);
module.exports=user;