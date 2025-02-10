const express = require("express");
const HouseKeepingController = require("../controllers/HouseKeepingController");

const HouseKeepingRouter = express.Router();
HouseKeepingRouter.post("/maintenancecreate",HouseKeepingController.maintenancecreate)
HouseKeepingRouter.get("/maintenancelist",HouseKeepingController.maintenancelist)
HouseKeepingRouter.post("/taskassign",HouseKeepingController.taskassign)
HouseKeepingRouter.get("/tasklist/:id",HouseKeepingController.tasklist)
HouseKeepingRouter.put("/taskread/:id",HouseKeepingController.taskread)
HouseKeepingRouter.put("/taskupdate/:id",HouseKeepingController.taskupdate)

module.exports=HouseKeepingRouter;