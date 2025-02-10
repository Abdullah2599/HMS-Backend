const HouseKeepingService = require("../service/HouseKeepingService")

class HouseKeepingController{
    async maintenancecreate(req,res){
        await HouseKeepingService.maintainancecreate(req,res)
    }
    async maintenancelist(req,res){
        await HouseKeepingService.maintainancelist(req,res)
    }
    async taskassign(req,res){
        await HouseKeepingService.taskAssign(req,res)
    }
    async tasklist(req,res){
        await HouseKeepingService.tasklist(req,res)
    }
    async taskread(req,res){
        await HouseKeepingService.taskread(req,res)
    }
    async taskupdate(req,res){
        await HouseKeepingService.taskupdate(req,res)
    }
}
module.exports=new HouseKeepingController