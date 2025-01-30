const AdditionalService = require("../models/AdditionalService");

class Aditional_SService{
    async create(req,res){
        try {
            const body = (({name,price}) => ({name,price}))(req.body);
            const Aditionaldata = await AdditionalService.findOne({name:body.name});
            if(Aditionaldata){
                return res.status(400).json({ message: `error : Service already exist!` });
            }
            if(body.price<0){
                return res.status(400).json({ message: `error : Invalid Price` });
            }
            const data= await AdditionalService.insertMany([body]);
            return res.status(200).json({ message: `Aditional Service Registered` , data:data});
            
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async list(req,res){
        try {
            const data =await AdditionalService.find();
            return res.status(200).json({ message: `Aditional Service data` , data:data});
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new Aditional_SService