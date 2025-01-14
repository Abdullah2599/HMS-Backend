const express = require("express");
const PermissionListController = require("../controllers/PermissionListController");
const permission_listRequest = require("../request/PermissionListRequest");


const PermissionListRouter = express.Router();
PermissionListRouter.post("/create",permission_listRequest.validationRules(),permission_listRequest.validate,PermissionListController.create)
PermissionListRouter.get("/list",PermissionListController.list)
PermissionListRouter.delete("/:id",PermissionListController.delete)
module.exports=PermissionListRouter;