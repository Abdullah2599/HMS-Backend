const express = require("express");
const HouseKeepingController = require("../controllers/HouseKeepingController");

const HouseKeepingRouter = express.Router();
HouseKeepingRouter.post("/maintenancecreate",HouseKeepingController.maintenancecreate)
HouseKeepingRouter.get("/maintenancelist",HouseKeepingController.maintenancelist)
module.exports=HouseKeepingRouter;