const jwt = require("jsonwebtoken");
const Roles = require("../models/Roles")
const user = require("../models/User");
const bcrypt = require('bcrypt');
const { sendemail } = require("../thirdparty/mailer");
require("dotenv").config();
const key = process.env.KEY;

class UserService {
    code = null;
    data = {};
    constructor() {
        this.verificationCodes = new Map();
    }

    async register(req, res) {
        try {
            const role_id = await Roles.findOne({
                role_name: { $regex: /^guest$/i }
            });
            const data = (({ username, email, password, contact, CNIC, address }) => ({ username, email, password, contact, CNIC, address }))(req.body)
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            data.role = role_id._id;
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            this.code = verificationCode;
            this.data = data
            sendemail(data.email, verificationCode)

            return res.status(200).json({ message: "generate code successfully", code: this.code, data: this.data });
        } catch (error) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }

    async RegisterByDashboard(req, res) {
        try {
            const rolename = req.body.rolename;
            const role_id = await Roles.findOne({
                role_name: rolename
            });
            if (!role_id) {
                return res.status(400).json({ message: `error : ${rolename} role not found` });
            }
            const data = (({ username, email, password, contact, CNIC, address }) => ({ username, email, password, contact, CNIC, address }))(req.body)
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            data.role = role_id._id;
            const registered = await user.insertMany([data]);
            return res.status(200).json({ message: "User Created Successfully", data: registered });
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
            const userdata = await user.findOne({ email: data.email });
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
    async SuperAdminlogin(req, res) {
        try {
            const data = (({ email, password }) => ({ email, password }))(req.body);
            const userdata = await user.findOne({ email: data.email }).populate("role");

            if (!userdata) {
                res.status(404).json({ message: "No Record Found" });
                return;
            }
            if (userdata.role.role_name != "SuperAdmin") {
                res.status(404).json({ message: "Super Admin Not found" });
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