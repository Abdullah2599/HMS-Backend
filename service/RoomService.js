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
                    avaibility: isBooked ? "occupied" : room.avaibility
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
            const today = new Date();
    
            // Fetch the room data
            const data = await Room.findOne({ _id: id });
            console.log(data);
    
            // Check for active bookings for the room
            const bookedRooms = await booking.find({
                room: id,
                valid_from: { $lte: today },
                valid_to: { $gte: today }
            }).select("room");
    
            // If there are active bookings, the room should be available
            if (bookedRooms.length > 0) {
                if (data.avaibility === "disabled") {
                    // If the room is disabled, automatically enable it
                    await Room.findByIdAndUpdate(id, { avaibility: "available" });
                    return res.status(200).json({ msg: "Room is now available due to active booking." });
                }
                return res.status(200).json({ msg: "Room is already available due to an active booking." });
            }
    
            // If no active booking, handle changing the room status manually
            if (data.avaibility === "available") {
                const update = await Room.findByIdAndUpdate(id, { avaibility: "disabled" });
                return res.status(200).json({ msg: "Room disabled successfully." });
            }
    
            if (data.avaibility === "disabled") {
                const update = await Room.findByIdAndUpdate(id, { avaibility: "available" });
                return res.status(200).json({ msg: "Room available successfully." });
            }
    
            return res.status(200).json({ msg: "Room status cannot be changed." });
        } catch (error) {
            return res.status(400).json({ msg: `Error: ${error.message}` });
        }
    }
    
    async update(req, res) {
        try {
            const id = req.params.id;
            let facilityArray = [];
            const { description, roomType, size, person, price, roomTitle, facility } = req.body;
            const roomData = await Room.findById(id);
    
            if (!roomData) {
                return res.status(400).json({ msg: "Room not found" });
            }
            roomData.description = description || roomData.description;
            roomData.roomType = roomType || roomData.roomType;
            roomData.size = size || roomData.size;
            roomData.person = person || roomData.person;
            roomData.price = price || roomData.price;
            roomData.roomTitle = roomTitle || roomData.roomTitle;
    
            await roomData.save();
            let newFacilities = facility ? JSON.parse(facility) : [];
            let uniqueFacilities = [...new Set(newFacilities)];
            await RoomFacility.deleteMany({ room: roomData.id });
            facilityArray = uniqueFacilities.map(facilityId => ({ facility: facilityId, room: roomData.id }));
    
            if (facilityArray.length > 0) {
                await RoomFacility.insertMany(facilityArray);
            }
    
            return res.status(200).json({ msg: "Room updated successfully", roomData, facilities: facilityArray });
    
        } catch (error) {
            return res.status(400).json({ msg: `Error: ${error.message}` });
        }
    }
    
    async RoomRecordsbyid(req, res) {
        try {
            const id = req.params.id;
            const data = await Room.findOne({ _id: id }).populate({
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
}
module.exports = new RoomService