const Additional_SService = require("../service/Additional_SService");

class AdditionalServiceController{
    async create(req,res){
        await Additional_SService.create(req,res)
    }
    async list(req,res){
        await Additional_SService.list(req,res)
    }
    async delete(req,res){
    }
}
module.exports=new AdditionalServiceController;