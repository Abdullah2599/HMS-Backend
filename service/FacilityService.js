const Facility = require("../models/Facilities");

class FacilityService{
    async create(req,res){
        try {
            const body = (({name,icon}) => ({name,icon}))(req.body);
            const Facilitydata = await Facility.findOne({name:body.name});
            if(Facilitydata){
                return res.status(400).json({ message: `error : Facility already exist!` });
            }
            const data= await Facility.insertMany([body]);
            return res.status(200).json({ message: `Facility Registered` , data:data});
            
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async list(req,res){
        try {
            const data =await Facility.find();
            return res.status(200).json({ message: `Facility data` , data:data});
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new FacilityService