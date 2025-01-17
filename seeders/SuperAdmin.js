
const DB_hotel = require('../database/db');
const Roles = require('../models/Roles');
const User = require('../models/User');
const bcrypt = require('bcrypt');
DB_hotel();

async function generateAdmin() {
  try {
    const roleChecking = await Roles.findOne({ role_name: "SuperAdmin" });
    if (roleChecking) {
      await Roles.deleteMany({ role_name: "SuperAdmin" });
      console.log("Previous Role Deleted");
    }
    const roleInsert = await Roles.insertMany({ role_name: "SuperAdmin" })
    if (roleInsert) {
      console.log("Role 'SuperAdmin' inserted successfully.");
      const role = await Roles.findOne({ role_name: "SuperAdmin" });
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const payload = {
        "username": "SuperAdmin",
        "email": "admin123@gmail.com",
        "password": hashedPassword,
        "contact": "0000-0000000",
        "CNIC": "12345-6789012-3",
        "address": "123 Example Street, Example City, Example Country",
        "role": role._id
      }
      const UserCheck = await User.findOne({ email: "admin123@gmail.com" })
      if (UserCheck) {
        await User.deleteMany({ email: "admin123@gmail.com" });
        console.log("old admin remove")
      }
      const userInsert = await User.insertMany([payload]);
      if (userInsert) {
        console.log("SuperAdmin created successfully.");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

generateAdmin();
