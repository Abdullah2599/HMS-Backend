const express = require("express");
const BookingController = require("../controllers/BookingController");
const BookingRouter = express.Router();
BookingRouter.post("/create",BookingController.create)
BookingRouter.get("/list",BookingController.list)
BookingRouter.get("/record/:code",BookingController.bookingRecord)
BookingRouter.get("/guestbooking",BookingController.bookingRecordofGuest)
BookingRouter.post("/datefilter",BookingController.datefilter)
BookingRouter.put("/cancelbooking/:id",BookingController.bookingcancel)
module.exports=BookingRouter;