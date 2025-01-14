const express = require("express");
const PermissionController = require("../controllers/PermissionController");
const PermissionRouter = express.Router();
PermissionRouter.post("/create",PermissionController.create)
PermissionRouter.get("/list",PermissionController.list)
PermissionRouter.delete("/:id",PermissionController.delete)
module.exports=PermissionRouter;