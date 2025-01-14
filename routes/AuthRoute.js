const express = require("express");
const AuthController = require("../controllers/AuthController");
const UserRequest = require("../request/UserRequest");
const AuthRouter = express.Router();
AuthRouter.post("/register",UserRequest.validationRules(false),UserRequest.validate,AuthController.register)
AuthRouter.post("/verify",AuthController.verify)
AuthRouter.post("/login",AuthController.login)
module.exports=AuthRouter;