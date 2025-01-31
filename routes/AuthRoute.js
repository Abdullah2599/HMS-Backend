const express = require("express");
const AuthController = require("../controllers/AuthController");
const UserRequest = require("../request/UserRequest");
const authMiddleware = require("../middleware/authMiddleware");
const EditUserRequest = require("../request/EditUserRequest");
const AuthRouter = express.Router();
AuthRouter.post("/register",UserRequest.validationRules(false),UserRequest.validate,AuthController.register)
AuthRouter.post("/registerbydashboard",UserRequest.validationRules(false),UserRequest.validate,AuthController.RegisterByDashboard)
AuthRouter.post("/verifycode",AuthController.verify)
AuthRouter.post("/login",AuthController.login)
AuthRouter.post("/logout",authMiddleware.logout)
AuthRouter.post("/verifyuser",authMiddleware.verify)
AuthRouter.post("/list",AuthController.list)
AuthRouter.post("/usercreate",authMiddleware.verifyaccount,AuthController.usercreate)
AuthRouter.post("/userstatus/:id",AuthController.userStatus)
AuthRouter.post("/admin/login",AuthController.SuperAdminlogin)
AuthRouter.delete("/removedata/:id",authMiddleware.verifyaccount,AuthController.removedata)
AuthRouter.put("/editprofile",EditUserRequest.validationRules(),UserRequest.validate,authMiddleware.verifyaccount,AuthController.editprofile)
AuthRouter.put("/editpassword",EditUserRequest.validationRules(),UserRequest.validate,authMiddleware.verifyaccount,AuthController.editpassword)
module.exports=AuthRouter;