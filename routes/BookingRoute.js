const express = require("express");
const BookingController = require("../controllers/BookingController");
const BookingRouter = express.Router();
BookingRouter.post("/create",BookingController.create)
BookingRouter.post("/createbydashboard",BookingController.createbydashboard)
BookingRouter.get("/list",BookingController.list)
BookingRouter.post("/listbyroom",BookingController.listbyroom)
BookingRouter.get("/record/:code",BookingController.bookingRecord)
BookingRouter.get("/guestbooking",BookingController.bookingRecordofGuest)
BookingRouter.post("/datefilter",BookingController.datefilter)
BookingRouter.post("/bookingupdate/:id",BookingController.bookingupdate)
BookingRouter.put("/cancelbooking/:id",BookingController.bookingcancel)
module.exports=BookingRouter;