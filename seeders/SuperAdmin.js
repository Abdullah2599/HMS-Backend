const dbconnect = require('../config/dbconnect');
const User = require('../models/User');
const roleService = require('../services/roleService');
const bcrypt = require('bcrypt');
dbconnect();

async function generateUser() {
  try {
    //remove all superadmin
    await User.deleteMany({ email: 'superadmin@gmail.com' });

    const data = {
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: 'superadmin@gmail.com'
    };
    data.password = await bcrypt.hash(data.password, 10);

    const user = await User.insertMany([data]);
    roleService.assignRoleToUser(user[0], 'Super Admin');
    console.log("Super Admin Seeder Run Successfully!");
  } catch (err) {
    console.log(err);
  }
}

generateUser();
