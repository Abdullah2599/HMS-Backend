const express = require("express");
const AuthController = require("../controllers/AuthController");
const UserRequest = require("../request/UserRequest");
const authMiddleware = require("../middleware/authMiddleware");
const AuthRouter = express.Router();
AuthRouter.post("/register",UserRequest.validationRules(false),UserRequest.validate,AuthController.register)
AuthRouter.post("/registerbydashboard",UserRequest.validationRules(false),UserRequest.validate,AuthController.RegisterByDashboard)
AuthRouter.post("/verifycode",AuthController.verify)
AuthRouter.post("/login",AuthController.login)
AuthRouter.post("/logout",authMiddleware.logout)
AuthRouter.post("/verifyuser",authMiddleware.verify)
AuthRouter.post("/userstatus/:id",AuthController.userStatus)
AuthRouter.post("/SuperAdminlogin",AuthController.SuperAdminlogin)
module.exports=AuthRouter;