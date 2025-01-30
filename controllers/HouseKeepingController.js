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
}
module.exports=new HouseKeepingController