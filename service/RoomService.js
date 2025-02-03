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
                return res.status(400).json({ msg: "Error: Room Code Already Exists" });
            }
    
            const roomData = await Room.create({ roomCode, roomTitle, description, roomType, size, person, price, image, imagelg });
    
            // Manually parse the facility string if it's present
            let facility = req.body.facility ? JSON.parse(req.body.facility) : [];
    
            // Ensure unique facilities
            let uniqueFacilities = [...new Set(facility.map(item => item))];
    
            facilityArray = uniqueFacilities.map(facilityId => ({ facility: facilityId, room: roomData.id }));
    
            if (facilityArray.length > 0) {
                await RoomFacility.insertMany(facilityArray);
            }
    
            return res.status(200).json({ msg: "Room Registered", roomData, facilities: facilityArray });
        } catch (error) {
            return res.status(400).json({ msg: `Error: ${error.msg}` });
        }
    }
    
    

    async list(req, res) {
        try {
            const today = new Date();
            console.log("Today’s Date:", today);

            const bookedRooms = await booking.find({
                valid_from: { $lte: today },
                valid_to: { $gte: today }
            }).select("room");

            const bookedRoomIds = bookedRooms.map(b => b.room.toString());
            console.log("Booked Room IDs:", bookedRoomIds);

            const rooms = await Room.find().populate({
                path: "roomfacility",
                populate: {
                    path: "facility",
                    model: "facility"
                }
            });

            const roomData = rooms.map(room => {
                const isBooked = bookedRoomIds.includes(room._id.toString());
                return {
                    ...room.toObject(),
                    avaibility: isBooked ? "occupied" : "available"
                };
            });

            console.log("Final Room Data:", roomData);
            return res.status(200).json({ msg: "Room listing", roomdata: roomData });
        }
        catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ msg: `error : ${error}` });
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
                avaibility: "available",
                person: { $gte: req.body.person }
            }).populate({
                path: "roomfacility",
                populate: {
                    path: "facility",
                    model: "facility"
                }
            });

            return res.status(200).json({ msg: `Available rooms`, roomdata: availableRooms });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: `An error occurred`, error });
        }

    }
    async availableRoomslist(req, res) {
        try {
            const data = await Room.find({ avaibility: "available" }).populate({
                path: "roomfacility", populate: {
                    path: "facility",
                    model: "facility"
                }
            });
            return res.status(200).json({ msg: `Available Room listing`, roomdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async RoomRecords(req, res) {
        try {
            const room_code = req.params.code;
            const data = await Room.findOne({ roomCode: room_code }).populate({
                path: "roomfacility",
                populate: {
                    path: "facility",
                    model: "facility"
                }
            });
            if (!data) {
                return res.status(400).json({ msg: `error : Room Not Found` });
            }
            return res.status(200).json({ msg: `Room Record`, roomdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async statusRoom(req, res) {
        try {
            const id = req.params.id;
            const data = await Room.findOne({ _id: id });
            console.log(data)
            if (data.avaibility == "available") {
                const update = await Room.findByIdAndUpdate(id, { avaibility: "disabled" })
                return res.status(200).json({ msg: `Room disabled Successfully` });
            }
            if (data.avaibility == "disabled") {
                const update = await Room.findByIdAndUpdate(id, { avaibility: "available" })
                return res.status(200).json({ msg: `Room available Successfully` });
            }
            return res.status(200).json({ msg: `Room status can not be changed` });

        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async update(req, res) {
        try {

            const id = req.params.id
            let facilityArray = [];
            const { description, roomType, size, person, price, image, imagelg } = req.body;

            console.log(bookedRooms)
            const roomData = await Room.findByIdAndUpdate(id, { description, roomType, size, person, price, image, imagelg });

            let facility = req.body.facility || [];
            let uniqueFacilities = [...new Set(facility.map(item => item.facility))];

            for (let facilityId of uniqueFacilities) {
                const exists = await RoomFacility.findOne({ facility: facilityId, room: roomData.id });

                if (!exists) {
                    facilityArray.push({ facility: facilityId, room: roomData.id });
                }
            }
            if (facilityArray.length > 0) {
                await RoomFacility.insertMany(facilityArray);
            }

            return res.status(200).json({ msg: "Room Registered", roomData, facilities: facilityArray });
        } catch (error) {
            return res.status(400).json({ msg: `Error: ${error.msg}` });
        }
    }
   
}
module.exports = new RoomService