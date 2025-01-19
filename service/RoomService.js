const RoomFacility = require("../models/joins/RoomFacility");
const Room = require("../models/Room");

class RoomService{
    async create(req,res){
        try {
            const body = (({roomCode, roomTitle, description, roomType, size, person, price, image, imagelg }) => ({roomCode, roomTitle, description, roomType , size, person, price, image, imagelg }))(req.body);
            const facility=req.body.facility;
            const roomdata = await Room.findOne({roomCode:body.roomCode});
            if(roomdata){
                return res.status(400).json({ message: `error : Room Code Already Exist` });
            }
            const facilitydata=await RoomFacility.insertMany([facility]);
            const data = await Room.insertMany([body]);
            return res.status(200).json({ message: `Room Registered` , roomdata:data , facility:facilitydata });
            
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports=new RoomService