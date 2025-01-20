const RoomFacility = require("../models/joins/RoomFacility");
const Room = require("../models/Room");

class RoomService {
    async create(req, res) {
        try {
            let facilityArray = [];
            const body = (({ roomCode, roomTitle, description, roomType, size, person, price, image, imagelg }) => ({ roomCode, roomTitle, description, roomType, size, person, price, image, imagelg }))(req.body);
            const facility = req.body.facility;
            const roomdata = await Room.findOne({ roomCode: body.roomCode });
            if (roomdata) {
                return res.status(400).json({ message: `error : Room Code Already Exist` });
            }
            const data = await Room.create(body);
            facility.map((item) => {
                const record = { facility: item.facility, room: data.id };
                facilityArray.push(record);
            })
            console.log(facilityArray)
            if (facilityArray.length > 0) {
                const facilitydata = await RoomFacility.insertMany(facilityArray);
            }

            return res.status(200).json({ message: `Room Registered`, roomdata: data, facility: facilityArray });

        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
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
}
module.exports = new RoomService