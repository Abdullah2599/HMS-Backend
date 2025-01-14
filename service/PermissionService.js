const Permission = require("../models/Permission");

class PermissionService {
    async create(req, res) {
        try {
            const permission = (({ role,permission_list }) => ({ role,permission_list }))(req.body);
            await Permission.insertMany([permission]);

            res.status(200).json({ message: "permission inserted Successfully" });
        }
        catch (err) {
            res.status(400).json({ message: `error: ${err}` });
        }
    }
    async list(req, res) {
        try {
            const data=await Permission.find({}).populate('role').populate('permission_list');;
            res.status(200).json({ message: "permissions joining list", data:data });
        }
        catch (err) {
            res.status(400).json({ message: `error: ${err}` });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            const data=await Permission.findByIdAndDelete(id);
            res.status(200).json({ message: "Record Deleted Successfully", data:data });
        }
        catch (err) {
            res.status(400).json({ message: `error: ${err}` });
        }
    }
}
module.exports=new PermissionService