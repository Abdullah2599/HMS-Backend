const PermissionListService = require("../service/PermissionListService");

class PermissionListController{
    async create(req,res){
        await PermissionListService.create(req,res)
    }
    async list(req,res){
        await PermissionListService.list(req,res)
    }
    async delete(req,res){
        await PermissionListService.delete(req,res)
    }
}
module.exports=new PermissionListController;