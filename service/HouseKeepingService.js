const { default: mongoose } = require("mongoose");
const Maintenance = require("../models/Maintenance");
const Task = require("../models/Task");
const user = require("../models/User");


class HouseKeepingService{
    async maintainancecreate(req,res){
        try {
            const data = (({type})=>({type}))(req.body)
            const filter= await Maintenance.findOne(data);
            if(data.type == null || data.type == ""){
                return res.status(400).json({ message: `not accepted a null data` }); 
            }
            if(filter){
                return res.status(400).json({ message: `maintenance type already inserted` }); 
            }
            const insert = await Maintenance.insertMany([data]);      
            return res.status(400).json({ message: `maintenance type inserted` }); 

        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async maintainancelist(req,res){
        try {
            const data = await Maintenance.find();
            return res.status(200).json({ message: `Maintenance data` , data:data});
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async taskAssign(req,res){
        try {
            const data = (({maintenance,housekeeper,task,deadline})=>({maintenance,housekeeper,task,deadline}))(req.body)
            if (!mongoose.isValidObjectId(data.housekeeper)) {
                return res.status(400).json({ message: "Invalid HouseKeeper ID" });
            }
            const filter= await Maintenance.findOne(data);
            if(filter){
                return res.status(400).json({ message: `Task Already Assign` }); 
            }
            const today = new Date().setHours(0, 0, 0, 0);
        const deadlineDate = new Date(data.deadline).setHours(0, 0, 0, 0);
        if (deadlineDate < today) {
            return res.status(400).json({ message: "Please insert today's or a future date" });
        }
            const check = await user.findOne({_id:data.housekeeper}).populate("role")
            console.log(check)
            
            if(check.role.role_name !== "HouseKeeping"){
                return res.status(400).json({ message: `Invalid HouseKeeper` });
            }
            const insert = await Task.insertMany([data]);      
            return res.status(200).json({ message: `task Assign Successfully`,data:insert });


        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new HouseKeepingService