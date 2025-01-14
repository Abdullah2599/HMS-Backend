const { body, validationResult } = require('express-validator');
const Roles = require('../models/Roles');
class RoleRequest {
  static validationRules() {
    const rules = [
      body('role_name')
        .isString().withMessage('role_name must be in String')
        .custom(async (value, { req }) => {
          const role_name = await Roles.findOne({role_name:value});
          if (role_name) {
            return Promise.reject('role already inserted');
          }
        }),  
    ];

    return rules;
  }
  static validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}
module.exports = RoleRequest;
