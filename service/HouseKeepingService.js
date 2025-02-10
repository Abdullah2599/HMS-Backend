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
                return res.status(400).json({ msg: `not accepted a null data` }); 
            }
            if(filter){
                return res.status(400).json({ msg: `maintenance type already inserted` }); 
            }
            const insert = await Maintenance.insertMany([data]);      
            return res.status(200).json({ msg: `maintenance type inserted` }); 

        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async maintainancelist(req,res){
        try {
            const data = await Maintenance.find();
            return res.status(200).json({ msg: `Maintenance data` , data:data});
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async taskAssign(req,res){
        try {
            const data = (({maintenance,housekeeper,task,deadline,priority,room})=>({maintenance,housekeeper,task,deadline,priority,room}))(req.body)
            if (!mongoose.isValidObjectId(data.housekeeper)) {
                return res.status(400).json({ msg: "Invalid HouseKeeper ID" });
            }
            const filter= await Maintenance.findOne(data);
            if(filter){
                return res.status(400).json({ msg: `Task Already Assign` }); 
            }
            
            const check = await user.findOne({_id:data.housekeeper}).populate("role")
            console.log(check)
            
            if(check.role.role_name !== "housekeeping"){
                return res.status(400).json({ msg: `Invalid HouseKeeper` });
            }
            const insert = await Task.insertMany([data]);      
            return res.status(200).json({ msg: `task Assign Successfully`,data:insert });


        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async tasklist(req,res){
        try {
            const id = req.params.id;
            const data = await Task.find({housekeeper:id}).populate("room").populate("housekeeper").populate("maintenance");
            if(!data){
                return res.status(400).json({ msg: `record not found`});
            }
            return res.status(200).json({ msg: `task list`,data:data });


        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async taskread(req,res){
        try {
            const id = req.params.id;
            const data = await Task.findOne({_id:id}).populate("room").populate("housekeeper").populate("maintenance");
            if(!data){
                return res.status(400).json({ msg: `record not found`});
            }
            if(data.read == true){
                return res.status(400).json({ msg: `task already read`});
            }
            const read = await Task.findByIdAndUpdate(id,{read:true});
            return res.status(200).json({ msg: `task read successfully`});

        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async taskupdate(req,res){
        try {
            const id = req.params.id;
            const data = await Task.findOne({_id:id}).populate("room").populate("housekeeper").populate("maintenance");
            if(!data){
                return res.status(400).json({ msg: `record not found`});
            }
            if(data.read == false){
                return res.status(400).json({ msg: `msg does'nt read`});
            }
            if(data.status == "success"){
                return res.status(400).json({ msg: `task already successed`});
            }
            const update = await Task.findByIdAndUpdate(id,{status:"success"});
            return res.status(200).json({ msg: `task read successfully`});

        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
}
module.exports=new HouseKeepingService