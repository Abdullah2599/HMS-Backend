const AdditionalService = require("../models/AdditionalService");
const booking = require("../models/Booking");
const Room = require("../models/Room");
const generateCode = require("../thirdparty/codegenerator");
const additional_booking = require("../models/joins/AdditionalBooking");
const Stripe = require("stripe");
const stripe = new Stripe('sk_test_51PgZW0RurkMN3umpSM5JmG2HkvNvaGqYV122LWUrb9W8fhZ8fPqK0bm99MLE5HUsmCW6QfzyVG1hPcTNAFPGVeTJ00jcNbV33f'); // Replace with your actual Stripe secret key

const { bookingEmail } = require("../thirdparty/mailer");
class BookingService {
    async create(req, res) {
        try {
            let AdditionalServiceData = [];
            let services = []
            let totalamount = 0;
            const body = (({ room, valid_to, valid_from }) => ({ room, valid_to, valid_from }))(req.body);
            const fromDate = new Date(body.valid_from);
            const toDate = new Date(body.valid_to);
            const days = (Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24))) + 1;
            console.log(days);

            body.booking_code = generateCode();
            body.guest = req.user.id;
            const service = Array.isArray(req.body.service) ? req.body.service : [];
            const bookingdata = await booking.findOne({ booking_code: body.booking_code });
            const roomdata = await Room.findOne({ _id: body.room });
            const datefilter = await booking.findOne({
                room: body.room,
                $or: [
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if (datefilter) {
                return res.status(400).json({ message: `error : room already booked` });
            }
            if (!roomdata) {
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
                    services.push(serviceData)
                    totalamount += serviceData.price;
                    AdditionalServiceData.push(record);
                }
            }
            body.totalBill = (totalamount + roomdata.price) * days;
            const addservice = await additional_booking.insertMany(AdditionalServiceData);

            body.paymentstatus = "paid";
            const update = await booking.findByIdAndUpdate(data.id, body);
            bookingEmail(req.user.email, roomdata.roomCode, services, body.totalBill);
            return res.status(200).json({ message: `Booking Registered`, totalbill: body.totalBill, Bookingdata: update, AdditionalService: addservice });


        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
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

            return res.status(200).json({ message: `Booking listing`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }

    async bookingRecordofGuest(req, res) {
        try {
            const user = req.user.id;
            const data = await booking.find({ guest: user });
            if (!data) {
                return res.status(400).json({ message: `error : Booking Not Found` });
            }
            return res.status(200).json({ message: `Booking record`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }

    async bookingRecord(req, res) {
        try {
            const booking_code = req.params.code;
            const data = await booking.findOne({ booking_code: booking_code });
            if (!data) {
                return res.status(400).json({ message: `error : Booking Not Found` });
            }
            return res.status(200).json({ message: `Booking record`, Bookingdata: data });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async datefilter(req, res) {
        try {
            const body = (({ room, valid_to, valid_from }) => ({ room, valid_to, valid_from }))(req.body);
            const roomdata = await Room.findOne({ _id: body.room });
            const datefilter = await booking.findOne({
                room: body.room,
                $or: [
                    { valid_from: { $lte: body.valid_to }, valid_to: { $gte: body.valid_from } }
                ]
            });
            if (datefilter) {
                return res.status(400).json({ message: `error : room already booked` });
            }
            return res.status(200).json({ message: `room available` });
        }
        catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
}
module.exports = new BookingService