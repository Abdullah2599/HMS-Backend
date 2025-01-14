const PermissionService = require("../service/PermissionService");

class PermissionController{
    async create(req,res){
        PermissionService.create(req,res)
    }
    async list(req,res){
        PermissionService.list(req,res)
    }
    async delete(req,res){
        PermissionService.delete(req,res)
    }
}
module.exports=new PermissionController;