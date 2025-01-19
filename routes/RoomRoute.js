const express = require("express");
const RoomController = require("../controllers/RoomController");
const RoomRouter = express.Router();
RoomRouter.post("/create",RoomController.create)
module.exports=RoomRouter;