const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.KEY
let blacklist = [];
class Authentication_M {
    async verifyaccount(req, res, next) {
        try {
            const header = req.headers["authorization"];
            if (!header) {
                return res.status(400).json({ message: "Token is empty" });
            }
    
            const token = header.split(" ")[1];
            if (!token) {
                return res.status(400).json({ message: "Token is empty" });
            }
    
            if (blacklist.includes(token)) {
                return res.status(400).json({ message: "Token revoked" });
            }
    
            jwt.verify(token, key, (err, user) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Token expired" });
                    }
                    return res.status(403).json({ message: "Invalid token" });
                }
    
                req.user = user;
                next(); // Proceed to next middleware
            });
        } catch (error) {
            console.error("Server error in verifyaccount function:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async verify(req, res) {
        try {
            const header = req.headers["authorization"];
            if (!header) {
                return res.status(400).json({ message: "Token is empty" });
            }
    
            const token = header.split(" ")[1];
            if (!token) {
                return res.status(400).json({ message: "Token is empty" });
            }
    
            if (blacklist.includes(token)) {
                return res.status(400).json({ message: "Token revoked" });
            }
    
            jwt.verify(token, key, (err, user) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Token expired" });
                    }
                    return res.status(403).json({ message: "Invalid token" });
                }
                req.user = user;
                return res.status(200).json({ message: "User found", user: req.user });
            });
        } catch (error) {
            console.error("Server error in verify function:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async logout(req, res) {
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
        blacklist.push(token)
        res.status(200).json({ message: "token revoke" });
        return;


    }
}
module.exports = new Authentication_M