const RolesService = require("../service/RolesService");

class RolesController{
    async create(req,res){
        await RolesService.create(req,res);
    }
    async list(req,res){
        await RolesService.list(req,res);
    }
    async delete(req,res){
        await RolesService.delete(req,res);
    }
}
module.exports=new RolesController;