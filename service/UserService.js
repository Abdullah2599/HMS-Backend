const jwt = require("jsonwebtoken");
const Roles = require("../models/Roles")
const nodemailer = require("nodemailer");
const user = require("../models/User");
const bcrypt = require('bcrypt');
require("dotenv").config();
const key=process.env.KEY;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ua5495404@gmail.com",
        pass: "blymsphfkkhinwnq",
    },
});
class UserService {
    code = null;
    data = {};
    constructor() {
        this.verificationCodes = new Map();
    }
    async sendemail(email, code) {
        try {
            const info = await transporter.sendMail({
                from: '"code verification" <ua5495404@gmail.com>',
                to: email,
                subject: "code verification",
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                            }
                            .container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                color: #333333;
                                font-size: 24px;
                                margin-bottom: 20px;
                            }
                            .code-box {
                                display: flex;
                                justify-content: space-between;
                                flex-wrap: wrap;
                                gap: 10px;
                            }
                            .code {
                                margin: 0% auto;
                                width: 50%;
                                padding: 20px;
                                text-align: center;
                                font-size: 22px;
                                font-weight: bold;
                                background-color: #f0f0f0;
                                border-radius: 8px;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                color: #333333;
                            }
                            .code:hover {
                                background-color: #d1e7dd;
                                transition: background-color 0.3s;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Hotel Management Verification</h2>
                            <div class="code-box">
                                <div class="code">${code}</div>
                            </div>
                        </div>
                    </body>
                </html>
            `,
            });
        }
        catch (err) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async register(req, res) {
        try {
            const role_id = await Roles.findOne({
                role_name: { $regex: /^guest$/i }
            });
            const data = (({ username, email,password }) => ({ username, email,password }))(req.body)
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password=hashedPassword;
            data.role = role_id._id;
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            this.code = verificationCode;
            this.data = data
            this.sendemail(data.email, verificationCode)

            return res.status(200).json({ message: "generate code successfully", code: this.code, data: this.data });
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }
    async codeverify(req, res) {
        try {
            const data = (({ code }) => ({ code }))(req.body)
            if (this.code == null) {
                return res.status(400).json({ message: `please again registered first` });
            }
            if (data.code == null) {
                return res.status(400).json({ message: `user inserted a null code` });
            }
            if (data.code != this.code) {
                return res.status(400).json({ message: `user inserted a wrong code` });
            }
            
            const registered = await user.insertMany([this.data]);
            this.data = null; this.code = null;
            return res.status(200).json({ message: "user registered successfully", data: registered });
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }


    }
    async login(req, res) {
        try {
            const data = (({ email, password }) => ({ email, password }))(req.body);
            const userdata = await user.findOne({email:data.email});
            if (!userdata) {
                res.status(404).json({ message: "No Record Found" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(data.password, userdata.password);  

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }
            const payload = {
                id: userdata._id,
                name: userdata.name,
                email: userdata.email
            }
            const token = jwt.sign(payload, key, { expiresIn: "2hr" });
            res.status(200).json({ message: "token create", token: token })
        }
        catch (err) {
            return res.status(400).json({ message: `error : ${err}` });
        }
    }
    async logout(req, res) {

    }
}

module.exports = new UserService;