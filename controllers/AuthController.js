const UserService = require("../service/UserService");

class AuthController{
    async register(req,res){
        await UserService.register(req,res);
    }
    async verify(req,res){
        await UserService.codeverify(req,res);
    }
    async login(req,res){
        await UserService.login(req,res);
    }
}
module.exports=new AuthController;