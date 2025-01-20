const express = require("express");
const AdditionalServiceController = require("../controllers/AdditionalServiceController");
const AdditionalServiceRouter = express.Router();
AdditionalServiceRouter.post("/create",AdditionalServiceController.create)
AdditionalServiceRouter.get("/list",AdditionalServiceController.list)
module.exports=AdditionalServiceRouter;