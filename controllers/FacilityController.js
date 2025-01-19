const FacilityService = require("../service/FacilityService");


class FacilityController{
    async create(req,res){
        await FacilityService.create(req,res)
    }
    async list(req,res){
    }
    async delete(req,res){
    }
}
module.exports=new FacilityController;