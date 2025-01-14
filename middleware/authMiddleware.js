const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.PLATFORM_KEY
class Authentication_M{
    async verifyaccount(req, res, next) {
        const header = req.headers["authorization"];
        if (header == null) {
            res.status(400).json({ message: "token is empty" });
            return;
        }
        const token = header.split(" ")[1];
        if (token == null) {
            res.status(400).json({ message: "token is empty" });
            return;
        }
        if (blacklist.includes(token)) {
            res.status(400).json({ message: "token revoke" });
            return;
        }
        jwt.verify(token, key, (err, user) => {
            if (err) {
                res.status(404).json({ message: "Invalid token" });
            }
            req.user = user;
        })
        next();
    }
}
module.exports=new Authentication_M