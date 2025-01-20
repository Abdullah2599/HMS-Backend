const express = require("express");
const BookingController = require("../controllers/BookingController");
const BookingRouter = express.Router();
BookingRouter.post("/create",BookingController.create)
BookingRouter.get("/list",BookingController.list)
module.exports=BookingRouter;