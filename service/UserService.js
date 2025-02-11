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

            return res.status(200).json({ msg: "generate code successfully", code: this.code, data: this.data });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async RegisterByDashboard(req, res) {
        try {
            const rolename = req.body.rolename;
            const role_id = await Roles.findOne({
                role_name: rolename
            });
            if (!role_id) {
                return res.status(400).json({ msg: `error : ${rolename} role not found` });
            }
            const data = (({ username, email, password, contact, CNIC, address }) => ({ username, email, password, contact, CNIC, address }))(req.body)
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            data.role = role_id._id;
            const registered = await user.insertMany([data]);
            return res.status(200).json({ msg: "User Created Successfully", data: registered });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async codeverify(req, res) {
        try {
            const data = (({ code }) => ({ code }))(req.body)
            if (this.code == null) {
                return res.status(400).json({ msg: `please again registered first` });
            }
            if (data.code == null) {
                return res.status(400).json({ msg: `user inserted a null code` });
            }
            if (data.code != this.code) {
                return res.status(400).json({ msg: `user inserted a wrong code` });
            }

            const registered = await user.insertMany([this.data]);
            this.data = null; this.code = null;
            return res.status(200).json({ msg: "user registered successfully", data: registered });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }


    }
    async login(req, res) {
        try {
            const data = (({ email, password }) => ({ email, password }))(req.body);
            const userdata = await user.findOne({ email: data.email }).populate({
                path: 'role',
                model: 'roles' // Ensure that your 'roles' model is correctly imported and referenced
            });

            if (!userdata) {
                res.status(404).json({ msg: "No Record Found" });
                return;
            }
            if (userdata.status === "InActive") {
                res.status(400).json({ msg: "Inactive UserId" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(data.password, userdata.password);

            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Invalid password" });
            }
            const payload = {
                id: userdata._id,
                name: userdata.username,
                email: userdata.email,
                contact: userdata.contact,
                rolename: userdata.role.role_name
            }
            const token = jwt.sign(payload, key, { expiresIn: "2hr" });
            res.status(200).json({ msg: "token create", token: token })
        }
        catch (err) {
            return res.status(400).json({ msg: `error : ${err}` });
        }
    }
    async SuperAdminlogin(req, res) {
        try {
            const data = (({ email, password }) => ({ email, password }))(req.body);
            const userdata = await user.findOne({ email: data.email }).populate("role");

            if (!userdata) {
                res.status(404).json({ msg: "No Record Found" });
                return;
            }
            if (userdata.role.role_name == "Guest") {
                res.status(404).json({ msg: "Staff Not found" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(data.password, userdata.password);

            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Invalid password" });
            }
            const payload = {
                id: userdata._id,
                name: userdata.username,
                email: userdata.email,
                rolename: userdata.role.role_name
            }
            const token = jwt.sign(payload, key, { expiresIn: "2hr" });
            res.status(200).json({ msg: "token create", token: token })
        }
        catch (err) {
            return res.status(400).json({ msg: `error : ${err}` });
        }
    }

    async userStatus(req, res) {
        try {
            const data = (({ status }) => ({ status }))(req.body);
            const user_id = req.params.id;
            const user_data = await user.findOne({ _id: user_id });
            if (data.status == "Active" && user_data.status == "Active") {
                return res.status(400).json({ msg: `error : User Already Active` });
            }
            if (data.status == "InActive" && user_data.status == "InActive") {
                return res.status(400).json({ msg: `error : User Already InActive` });
            }
            const update = await user.findByIdAndUpdate(user_id, { status: data.status });
            res.status(200).json({ msg: `User ${data.status} successfully` })
        }
        catch (err) {
            return res.status(400).json({ msg: `error : ${err}` });
        }
    }
    async editprofile(req, res) {
        try {
            const id = req.params.id;
            const userrecord=await user.findOne({_id:id});
            if(!userrecord){
                return res.status(400).json({ msg: `error : Edit Id not found` });
            }
            const data = (({ username, contact, address, status }) => ({ username, contact, address, status }))(req.body)
            const update = await user.findByIdAndUpdate(id, data);

            return res.status(200).json({ msg: "user successfully", data: update });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async editpassword(req, res) {
        try {
            const data = (({ password, newpassword, renewpassword }) => ({ password, newpassword, renewpassword }))(req.body)
            const email = req.user.email;
            const filteremail = await user.findOne({ email: email });
            console.log(filteremail)
            const isPasswordValid = await bcrypt.compare(data.password, filteremail.password);
            console.log(isPasswordValid)
            if (!isPasswordValid) {
                return res.status(400).json({ msg: "Invalid password" });
            }
            if (data.newpassword != data.renewpassword) {
                return res.status(400).json({ msg: "password does'nt match" });
            }

            const hashedPassword = await bcrypt.hash(data.newpassword, 10);
            const body = {
                password: hashedPassword
            }
            const update = await user.findByIdAndUpdate(filteremail._id, body)
            return res.status(200).json({ msg: "password change successfully", data: body });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async removedata(req, res) {
        try {
            const id = req.params.id;
            const userdata = await user.findOne({ _id: id }).populate("role");
            if (userdata.role.role_name == "Guest") {
                return res.status(400).json({ msg: `error : guest data can not be deleted` });
            }
            const deletedata = await user.findByIdAndDelete(id);
            return res.status(200).json({ msg: "deleted successfully", data: deletedata });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }
    async list(req, res) {
        try {
            const data = (({ role_name }) => ({ role_name }))(req.body)
            const filter = await Roles.findOne({ role_name: data.role_name });
            if (!filter) {
                return res.status(400).json({ msg: `Invalid Role` });
            }
            const userList = await user.find({ role: filter._id }).populate("role")
            return res.status(200).json({ msg: "User List", data: userList });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async usercreate(req, res) {
        try {
            const data = (({ username, email, password, contact, CNIC, address, status }) => ({ username, email, password, contact, CNIC, address, status }))(req.body)
            const role = req.body.role;
            const role_id = await Roles.findOne({
                role_name: role
            });
            console.log(role)
            if (!role_id) return res.status(400).json({ msg: "Invalid role provided" });
            const filter = await user.findOne({email:data.email})
            if (filter) return res.status(400).json({ msg: "email already exist" });
            data.role=role_id._id;
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            const register = await user.insertMany([data]);

            return res.status(200).json({ msg: "guest registered successfully", data: register });
        } catch (error) {
            return res.status(400).json({ msg: `error : ${error}` });
        }
    }

    async checkStatus(req, res) {
        try {
            const user_id = req.params.id;
            const user_data = await user.findOne({ _id: user_id });
            if ( user_data.status == "InActive") {
                return res.status(400).json({ msg: `error : User Inactive` });
            }
            res.status(200).json({ msg: `User active` })
        }
        catch (err) {
            return res.status(400).json({ msg: `error : ${err}` });
        }
    }

}

module.exports = new UserService;