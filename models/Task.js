const mongoose = require("mongoose");
const {Schema} = mongoose;

const TaskSchema= new Schema({
    maintenance:({type:Schema.Types.ObjectId,ref:"maintenance"}),
    housekeeper:({type:Schema.Types.ObjectId,ref:"user"}),
    task:({type:String,required:true}),
    deadline:({type:Date,required:true}),
    status:({type:String,enum:["pending","success"],default:"pending"})
})
const Task = mongoose.model("task",TaskSchema);
module.exports=Task;