const express = require("express");
const FacilityController = require("../controllers/FacilityController");
const FacilityRouter = express.Router();
FacilityRouter.post("/create",FacilityController.create)
module.exports=FacilityRouter;