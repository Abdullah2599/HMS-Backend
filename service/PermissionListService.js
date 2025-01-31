const permission_list = require("../models/PermissionList");

class PermissionService {
    async create(req, res) {
        try {
            const permission_object = (({ Permission_name }) => ({ Permission_name }))(req.body);

            const data = await permission_list.findOne({Permission_name:permission_object.Permission_name});
            if (data != null) {
                res.status(400).json({ msg: "permission list already inserted" });
                return;
            }
            await permission_list.insertMany([permission_object]);
            res.status(200).json({ msg: "permission list inserted Successfully" });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
    async list(req, res) {
        try {
            const data=await permission_list.find();
            res.status(200).json({ msg: "permission List", data:data });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            const data=await permission_list.findByIdAndDelete(id);
            res.status(200).json({ msg: "Record Deleted Successfully", data:data });
        }
        catch (err) {
            res.status(400).json({ msg: `error: ${err}` });
        }
    }
}
module.exports=new PermissionService