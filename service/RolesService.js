const Roles = require("../models/Roles");

class RolesService {
    async create(req, res) {
        try {
            const role_object = (({ role_name }) => ({ role_name }))(req.body);

            const data = await Roles.findOne({role_name:role_object.role_name});
            if (data != null) {
                res.status(400).json({ msg: "role already inserted" });
                return;
            }
            await Roles.insertMany([role_object]);
            res.status(200).json({ msg: "role inserted Successfully" });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
    async list(req, res) {
        try {
            const data=await Roles.find().populate({path:"permissions", populate:{
                path:"permission_list",
                model:"permission_list"
            }});
            res.status(200).json({ msg: "Roles List", data:data });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            const data=await Roles.findByIdAndDelete(id);
            res.status(200).json({ msg: "Record Deleted Successfully", data:data });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
}
module.exports=new RolesService