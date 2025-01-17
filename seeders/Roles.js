const DB_hotel = require('../database/db');
const Roles = require('../models/Roles');
const bcrypt = require('bcrypt');
DB_hotel();

async function FindRoles(role) {
  const roleCheck = await Roles.findOne({ role_name: role });
  if (roleCheck) {
    console.log(`"${role}" Role already exists.`);
    return true; // Role exists
  }
  return false; // Role does not exist
}

async function generateRole() {
  try {
    let roles = ["Guest", "HouseKeeping", "manager", "receptionist"];
    const existingRoles = [];
    for (const role of roles) {
      const exists = await FindRoles(role);
      if (exists) {
        existingRoles.push(role);
      }
    }
    
    roles = roles.filter(role => !existingRoles.includes(role));
    console.log("Roles to insert:", roles);
    if (roles.length > 0) {
      await Roles.insertMany(roles.map(role => ({ role_name: role })));
      console.log("New roles inserted successfully.");
    } else {
      console.log("No new roles to insert.");
    }
  } catch (err) {
    console.log("Error:", err);
  }
}

generateRole();
