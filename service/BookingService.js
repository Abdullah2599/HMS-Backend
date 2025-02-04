const AdditionalService = require("../models/AdditionalService");
const booking = require("../models/Booking");
const Room = require("../models/Room");
const generateCode = require("../thirdparty/codegenerator");
const additional_booking = require("../models/joins/AdditionalBooking");
const { bookingEmail } = require("../thirdparty/mailer");
const user = require("../models/User");
class BookingService {
    async create(req, res) {
        try {
            let AdditionalServiceData = [];
            let services = []
            const body = (({ room, valid_to, valid_from, totalBill }) => ({ room, valid_to, valid_from, totalBill }))(req.body);

            body.booking_code = generateCode();
            body.guest = req.user.id;
            console.log(req.body); // Log the entire request body to inspect
            const service = req.body.service && Array.isArray(req.body.service) ? req.body.service : [];
            console.log(service); // Log the value of service after the check


            const bookingdata = await booking.findOne({ booking_code: body.booking_code });
            const roomdata = await Room.findOne({ _id: body.room });
            const datefilter = await booking.findOne({
                room: body.room,
                $or: [
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if (datefilter) {
                return res.status(400).json({ msg: `error : room already booked` });
            }
            if (!roomdata) {
                return res.status(400).json({ msg: `error : room not exist in booking` });
            }
            if (bookingdata) {
                return res.status(400).json({ msg: `error : again booking please because room code already exist` });
            }
            const data = await booking.create(body);
            console.log(data);
            for (const item of service) {
                const record = { service: item.service, booking: data.id };
                const serviceData = await AdditionalService.findOne({ _id: item.service });
                console.log(serviceData)
                if (serviceData) {
                    services.push(serviceData)
                    AdditionalServiceData.push(record);
                }
            }
            const addservice = await additional_booking.insertMany(AdditionalServiceData);

            body.paymentstatus = "pending";
            const update = await booking.findByIdAndUpdate(data.id, body);
            bookingEmail(req.user.email, roomdata.roomCode, services, body.totalBill);
            return res.status(200).json({ msg: `Booking Registered`, totalbill: body.totalBill, Bookingdata: update, AdditionalService: addservice });


        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async list(req, res) {
        try {
            const data = await booking.find().populate({
                path: "service", populate: {
                    path: "service",
                    model: "additionalservice"
                }
            });

            return res.status(200).json({ msg: `Booking listing`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async bookingupdate(req, res) {
        try {
            const id = req.params.id;
            const paymentstatus = req.body.paymentstatus;
            
            const data = await booking.findOne({ _id: id });
            
            if (!data) {
                return res.status(400).json({ msg: 'Error: Booking not found' });
            }
            
            if (data.paymentstatus=="paid") {
                return res.status(400).json({ msg: 'Error: Payment already paid' });
            }
            const updatedBooking = await booking.findByIdAndUpdate(
                id,
                { paymentstatus: paymentstatus },
                { new: true } 
            );
    
            return res.status(200).json({ msg: 'Booking updated', Bookingdata: updatedBooking });
        } catch (error) {
            return res.status(400).json({ msg: `Error: ${error.message}` });
        }
    }
    

    async listbyroom(req, res) {
        try {
            const id = req.body.room
            const data = await booking.find({ room: id }).populate({
                path: "service", populate: {
                    path: "service",
                    model: "additionalservice"
                }
            }).populate("guest");

            return res.status(200).json({ msg: `Booking listing`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async bookingRecordofGuest(req, res) {
        try {
            const user = req.user.id;
            const data = await booking.find({ guest: user });
            if (!data) {
                return res.status(400).json({ msg: `error : Booking Not Found` });
            }
            return res.status(200).json({ msg: `Booking record`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async bookingRecord(req, res) {
        try {
            const booking_code = req.params.code;
            const data = await booking.findOne({ booking_code: booking_code });
            if (!data) {
                return res.status(400).json({ msg: `error : Booking Not Found` });
            }
            return res.status(200).json({ msg: `Booking record`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async datefilter(req, res) {
        try {
            const body = (({ room, valid_to, valid_from, person }) => ({ room, valid_to, valid_from, person }))(req.body);

            const roomdata = await Room.findOne({ _id: body.room });
            const datefilter = await booking.findOne({
                room: body.room,
                $or: [
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if (roomdata.person < body.person) {
                return res.status(400).json({ success: false, msg: 'Person value is greater than allowed for this room' });
            }
            if (datefilter) {
                return res.status(400).json({ msg: `error : room already booked` });
            }
            return res.status(200).json({ msg: `room available` });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async bookingcancel(req, res) {
        try {
            const today = new Date();
            const id = req.params.id;
            const data = await booking.findOne({ _id: id, valid_from: { $gte: today }, valid_to: { $gte: today } });
            if (!data) {
                return res.status(400).json({ msg: `error : Booking Not Found in Future` });
            }
            const update = await booking.findByIdAndUpdate(id, { paymentstatus: "cancel" })
            return res.status(200).json({ msg: `Booking record`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async createbydashboard(req, res) {
        try {
            let AdditionalServiceData = [];
            let services = []
            const body = (({ room, valid_to, valid_from, totalBill ,guest }) => ({ room, valid_to, valid_from, totalBill,guest }))(req.body);
            body.paymentstatus="paid";
            body.booking_code = generateCode();
            console.log(req.body); // Log the entire request body to inspect
            const service = req.body.service && Array.isArray(req.body.service) ? req.body.service : [];
            console.log(service); // Log the value of service after the check

            const userfilter = await user.findOne({_id:body.guest});
            if(!userfilter){
                return res.status(400).json({ msg: `user not found` });
            }
            const bookingdata = await booking.findOne({ booking_code: body.booking_code });
            const roomdata = await Room.findOne({ _id: body.room });
            const datefilter = await booking.findOne({
                room: body.room,
                $or: [
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if (datefilter) {
                return res.status(400).json({ msg: `error : room already booked` });
            }
            if (!roomdata) {
                return res.status(400).json({ msg: `error : room not exist in booking` });
            }
            if (bookingdata) {
                return res.status(400).json({ msg: `error : again booking please because room code already exist` });
            }
            const data = await booking.create(body);
            console.log(data);
            for (const item of service) {
                const record = { service: item.service, booking: data.id };
                const serviceData = await AdditionalService.findOne({ _id: item.service });
                console.log(serviceData)
                if (serviceData) {
                    services.push(serviceData)
                    AdditionalServiceData.push(record);
                }
            }
            const addservice = await additional_booking.insertMany(AdditionalServiceData);

            body.paymentstatus = "pending";
            const update = await booking.findByIdAndUpdate(data.id, body);
            bookingEmail(userfilter.email, roomdata.roomCode, services, body.totalBill);
            return res.status(200).json({ msg: `Booking Registered`, totalbill: body.totalBill, Bookingdata: update, AdditionalService: addservice });


        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
}
module.exports = new BookingService