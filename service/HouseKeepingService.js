const Maintenance = require("../models/Maintenance");


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
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async maintainancelist(req,res){
        try {
            const data = await Maintenance.find([]);
            return res.status(200).json({ message: `Maintenance data` , data:data});
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new HouseKeepingService