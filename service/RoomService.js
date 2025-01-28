const booking = require("../models/Booking");
const RoomFacility = require("../models/joins/RoomFacility");
const Room = require("../models/Room");

class RoomService {
    async create(req, res) {
        try {
          let facilityArray = [];
          const { roomCode, roomTitle, description, roomType, size, person, price, image, imagelg } = req.body;
      
          const roomExists = await Room.findOne({ roomCode });
          if (roomExists) {
            return res.status(400).json({ message: "Error: Room Code Already Exists" });
          }
      
          // Create the room with image paths
          const roomData = await Room.create({ roomCode, roomTitle, description, roomType, size, person, price, image, imagelg });
      
          // Handle facilities
          const facility = req.body.facility || [];
          facilityArray = facility.map((item) => ({ facility: item.facility, room: roomData.id }));
      
          if (facilityArray.length > 0) {
            await RoomFacility.insertMany(facilityArray);
          }
      
          return res.status(200).json({ message: "Room Registered", roomData, facilities: facilityArray });
        } catch (error) {
          return res.status(400).json({ message: `Error: ${error.message}` });
        }
      }
      
    async list(req, res) {
        try {
            const data = await Room.find().populate({
                path: "roomfacility", populate: {
                    path: "facility",
                    model: "facility"
                }
            });
            return res.status(200).json({ message: `Room listing`, roomdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async listbyfilter(req, res) {
        try {
            
            const bookedRooms = await booking.find({
                $or: [
                    { valid_from: { $lte: req.body.valid_to }, valid_to: { $gte: req.body.valid_from } }
                ]
            }).select('room');

            const bookedRoomIds = bookedRooms.map(booking => booking.room);
        
            const availableRooms = await Room.find({
                _id: { $nin: bookedRoomIds },
                person: {$gte:req.body.person} 
            }).populate({
                path: "roomfacility",
                populate: {
                    path: "facility",
                    model: "facility"
                }
            });
        
            return res.status(200).json({ message: `Available rooms`, roomdata: availableRooms });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `An error occurred`, error });
        }
        
    }

    async RoomRecords(req, res) {
        try {
            const room_code=req.params.code;
            const data = await Room.findOne({roomCode:room_code});
            if(!data){
                return res.status(400).json({ message: `error : Room Not Found` });
            }
            return res.status(200).json({ message: `Room Record`, roomdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports = new RoomService