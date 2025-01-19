const express = require("express");
const RolesController = require("../controllers/RolesController");
const RoleRequest = require("../request/RolesRequest");
const RolesRouter = express.Router();
RolesRouter.post("/create",RoleRequest.validationRules(),RoleRequest.validate,RolesController.create)
RolesRouter.get("/list",RolesController.list)
RolesRouter.delete("/:id",RolesController.delete)
module.exports=RolesRouter;