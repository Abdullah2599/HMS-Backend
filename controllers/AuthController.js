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
    async userStatus(req,res){
        await UserService.userStatus(req,res);
    }
    async removedata(req,res){
        await UserService.removedata(req,res);
    }
    async editpassword(req,res){
        await UserService.editpassword(req,res);
    }
    async editprofile(req,res){
        await UserService.editprofile(req,res);
    }
    async list(req,res){
        await UserService.list(req,res);
    }
    async usercreate(req,res){
        await UserService.usercreate(req,res);
    }
    async checkstatus(req,res){
        await UserService.checkStatus(req,res);
    }
}
module.exports=new AuthController;