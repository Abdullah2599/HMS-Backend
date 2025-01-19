const Facility = require("../models/Facilities");

class FacilityService{
    async create(req,res){
        try {
            const body = (({name,icon}) => ({name,icon}))(req.body);
            const Facilitydata = await Facility.findOne({name:body.name});
            if(Facilitydata){

            }
            const data= await Facility.insertMany([body]);
            return res.status(200).json({ message: `Facility Registered` , data:data});
            
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new FacilityService