const RoomService = require("../service/RoomService");

class RoomController{
    async create(req,res){
        await RoomService.create(req,res)
    }
    async list(req,res){
    }
    async delete(req,res){
    }
    async update(req,res){
    }
}
module.exports=new RoomController;