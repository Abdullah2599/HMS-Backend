const AdditionalService = require("../models/AdditionalService");
const booking = require("../models/Booking");
const Room = require("../models/Room");
const generateCode = require("../thirdparty/codegenerator");
const additional_booking = require("../models/joins/AdditionalBooking");
class BookingService {
    async create(req, res) {
        try {
            let AdditionalServiceData= [];
            let totalamount=0;
            const body = (({room,valid_to,valid_from}) => ({room,valid_to,valid_from}))(req.body);
            body.booking_code=generateCode();
            body.guest=req.user.id;
            const service = req.body.service;
            const bookingdata = await booking.findOne({ booking_code: body.booking_code });
            const roomdata= await Room.findOne({_id:body.room});
            const datefilter= await booking.findOne({
                room:body.room,
                $or:[
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if(datefilter){
                return res.status(400).json({ message: `error : room already booked` }); 
            }
            if(!roomdata){
                return res.status(400).json({ message: `error : room not exist in booking` }); 
            }
            if (bookingdata) {
                return res.status(400).json({ message: `error : again booking please because room code already exist` });
            }
            const data = await booking.create(body);
            console.log(data);
            for (const item of service) {
                const record = { service: item.service, booking: data.id };
                const serviceData = await AdditionalService.findOne({ _id: item.service });
                console.log(serviceData)
                if (serviceData) {
                    totalamount += serviceData.price;
                    AdditionalServiceData.push(record);
                }
            }
            body.totalBill = totalamount + roomdata.price;
            const addservice= await additional_booking.insertMany(AdditionalServiceData);
            const update= await booking.findByIdAndUpdate(data.id,body);
            return res.status(200).json({ message: `Booking Registered`, Bookingdata: update ,AdditionalService:addservice});

        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async list(req, res) {
        try {

            return res.status(200).json({ message: `Booking listing`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports = new BookingService