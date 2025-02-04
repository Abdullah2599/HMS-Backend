const mongoose = require("mongoose");
const {Schema} = mongoose;

const TaskSchema= new Schema({
    maintenance:({type:Schema.Types.ObjectId,ref:"maintenance"}),
    housekeeper:({type:Schema.Types.ObjectId,ref:"user"}),
    room:({type:Schema.Types.ObjectId,ref:"room"}),
    task:({type:String,required:true}),
    deadline:({type:Date,required:true}),
    priority:({type:String,required:true,enum:["low","medium","high"]}),
    status:({type:String,enum:["pending","success"],default:"pending"}),
    read:({type:String,enum:["true","false"],default:"false"})
})
const Task = mongoose.model("task",TaskSchema);
module.exports=Task;