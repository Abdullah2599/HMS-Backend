const { body, validationResult } = require('express-validator');
const permission_list = require('../models/PermissionList');

class permission_listRequest {
  static validationRules() {
    const rules = [
      body('Permission_name')
        .isString().withMessage('Permission_name must be in String')
        .custom(async (value, { req }) => {
          const Permission_name = await permission_list.findOne({Permission_name:value});
          if (Permission_name) {
            return Promise.reject('Permission_name already inserted');
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
module.exports = permission_listRequest;
