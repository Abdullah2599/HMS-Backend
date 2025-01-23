const RoomService = require("../service/RoomService");

class RoomController{
    async create(req,res){
        await RoomService.create(req,res);
    }
    async list(req,res){
        await RoomService.list(req,res);
    }
    async listbyfilter(req,res){
        await RoomService.listbyfilter(req,res);
    }
    async roomRecord(req,res){
        await RoomService.RoomRecords(req,res);
    }
    async delete(req,res){
    }
    async update(req,res){
    }
}
module.exports=new RoomController;