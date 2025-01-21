const express = require("express");
const RoomController = require("../controllers/RoomController");
const RoomRouter = express.Router();
RoomRouter.post("/create",RoomController.create)
RoomRouter.get("/list",RoomController.list)
RoomRouter.get("/record/:code",RoomController.roomRecord)
module.exports=RoomRouter;