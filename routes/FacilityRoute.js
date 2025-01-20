const express = require("express");
const FacilityController = require("../controllers/FacilityController");
const FacilityRouter = express.Router();
FacilityRouter.post("/create",FacilityController.create)
FacilityRouter.get("/list",FacilityController.list)
module.exports=FacilityRouter;