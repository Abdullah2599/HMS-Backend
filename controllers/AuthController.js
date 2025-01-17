const UserService = require("../service/UserService");

class AuthController{
    async register(req,res){
        await UserService.register(req,res);
    }
    async RegisterByDashboard(req,res){
        await UserService.RegisterByDashboard(req,res);
    }
    async verify(req,res){
        await UserService.codeverify(req,res);
    }
    async login(req,res){
        await UserService.login(req,res);
    }
    async SuperAdminlogin(req,res){
        await UserService.SuperAdminlogin(req,res);
    }
}
module.exports=new AuthController;